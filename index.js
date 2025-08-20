// file: src/app.js

// PENTING: Penyesuaian untuk __dirname di ES Modules
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mainRouter from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Global
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
// app.use(express.json());
app.use((req, res, next) => {
  console.log(`✅ Request Diterima dari Gateway: Method=${req.method}, Path=${req.originalUrl}`);
  next();
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter, mainRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API Gateway is healthy!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Professional API Gateway running on port ${PORT}`);
});