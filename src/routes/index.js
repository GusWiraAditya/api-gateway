// src/routes/index.js
const express = require('express');
const authRoutes = require('./auth.routes');
const proxyRoutes = require('./proxy.routes');

const router = express.Router();

// Rute orkestrasi seperti /api/register akan dicocokkan di sini
router.use('/api', authRoutes); 
// Semua rute proxy lainnya akan dicocokkan di sini
router.use(proxyRoutes);

module.exports = router;