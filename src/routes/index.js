import express from 'express';
import proxyRoutes from './proxy.routes.js';

const router = express.Router();

router.use(proxyRoutes);

export default router;