// src/routes/proxy.routes.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const serviceRegistry = require('../config/proxy.config');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

serviceRegistry.forEach(({ path, target, auth }) => {
  const proxyOptions = {
    target,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers['x-user-info']) {
        proxyReq.setHeader('x-user-info', req.headers['x-user-info']);
      }
    },
  };
  
  if (auth) {
    router.use(path, verifyToken, createProxyMiddleware(proxyOptions));
  } else {
    // Untuk path seperti '/api/auth' yang tidak perlu token, langsung proxy
    // pathRewrite mungkin diperlukan di sini jika path di service berbeda
    // Contoh: pathRewrite: {'^/api/auth': '/auth'}
    router.use(path, createProxyMiddleware(proxyOptions));
  }
});

module.exports = router;