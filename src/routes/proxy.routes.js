// File: API-GATEWAY/src/routes/proxy.routes.js

import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import routes from "../config/proxy.config.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();

const INTERNAL_SECRET = process.env.INTERNAL_SECRET_KEY;
if (!INTERNAL_SECRET) {
  throw new Error("FATAL ERROR: INTERNAL_SECRET_KEY is not defined.");
}
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
if (!ADMIN_SECRET) {
  throw new Error("FATAL ERROR: ADMIN_SECRET_KEY is not defined.");
}
const USER_SECRET = process.env.USER_SECRET_KEY;
if (!USER_SECRET) {
  throw new Error("FATAL ERROR: USER_SECRET_KEY is not defined.");
}
const LAYANAN_SECRET = process.env.LAYANAN_SECRET_KEY;
if (!LAYANAN_SECRET) {
  throw new Error("FATAL ERROR: LAYANAN_SECRET_KEY is not defined.");
}
const AUTH_SECRET = process.env.AUTH_SECRET_KEY;
if (!AUTH_SECRET) {
  throw new Error("FATAL ERROR: AUTH_SECRET_KEY is not defined.");
}

console.log("--- [DEBUG-ROUTER] Konfigurasi router proxy sedang dimuat ---");

routes.forEach((route) => {
  // LOG 1: Pastikan rute ini sedang dibuat
  console.log(`[DEBUG-ROUTER] Membuat konfigurasi untuk rute: ${route.path}`);

  const proxy = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route.path}`]: "",
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        /* handle proxyReq */
        console.log(
          `[DEBUG-PROXY] onProxyReq terpicu untuk rute: ${req.originalUrl}.`
        );
        const secretKey = route.secret; 
        if (secretKey) {
          proxyReq.setHeader('X-Internal-Secret', secretKey);
        }
        if (req.userInfo) {
          proxyReq.setHeader("X-User-Info", JSON.stringify(req.userInfo));
        }
      },
      proxyRes: (proxyRes, req, res) => {
        /* handle proxyRes */
      },
      error: (err, req, res) => {
        /* handle error */
        console.error("Proxy Error:", err);
        res
          .status(500)
          .json({ message: "Proxy Error. Could not connect to the service." });
      },
    },
  });

  // Middleware logger untuk melacak permintaan
  const requestTracker = (req, res, next) => {
    console.log(
      `[DEBUG-ROUTER] Permintaan ${req.method} ${req.originalUrl} cocok dengan path ${route.path}.`
    );
    next();
  };

  if (route.auth) {
    // Terapkan tracker SEBELUM verifyToken
    router.use(route.path, requestTracker, verifyToken, proxy);
  } else {
    router.use(route.path, requestTracker, proxy);
  }
});

export default router;
