import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from '../config/proxy.config.js'; 
import { verifyToken } from '../middleware/auth.middleware.js';
const router = Router();

routes.forEach(route => {
  const proxy = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    
    pathRewrite: {
        [`^${route.path}`]: '',
    },

    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ message: 'Proxy Error. Could not connect to the service.' });
    }
  });

  if (route.auth) {
    console.log(`[PROXY] Membuat rute aman: ${route.path} -> ${route.target}`);
    router.use(route.path, verifyToken, proxy);
  } else {
    console.log(`[PROXY] Membuat rute publik: ${route.path} -> ${route.target}`);
    router.use(route.path, proxy);
  }
});

export default router;