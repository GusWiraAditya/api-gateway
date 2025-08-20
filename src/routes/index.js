// file: src/routes/index.js

// DIUBAH: Menggunakan import
import express from 'express';
import authRoutes from './auth.routes.js';       // DIUBAH: Tambahkan .js
import proxyRoutes from './proxy.routes.js';     // DIUBAH: Tambahkan .js

const router = express.Router();

// Rute orkestrasi seperti /api/register akan dicocokkan di sini
router.use('/api', authRoutes);

// Semua rute proxy lainnya akan dicocokkan di sini
// proxy.routes.js sudah berisi path lengkap (/api/users, dll)
router.use(proxyRoutes);

// DIUBAH: Menggunakan export default
export default router;