// src/config/proxy.config.js
module.exports = [
  {
    path: '/api/auth',
    target: process.env.AUTH_SERVICE_URL,
    auth: false // Rute login/register tidak perlu verifikasi token
  },
  {
    path: '/api/admin',
    target: process.env.ADMIN_SERVICE_URL,
    auth: true,
    // Di masa depan, Anda bisa menambahkan 'role: "admin"' di sini untuk cek otorisasi
  },
  {
    path: '/api/users',
    target: process.env.USER_SERVICE_URL,
    auth: true
  },
  {
    path: '/api/complaints',
    target: process.env.USER_SERVICE_URL, // Mengarah ke service yang sama dengan Users
    auth: true
  },
  {
    path: '/api/feedbacks',
    target: process.env.USER_SERVICE_URL, // Mengarah ke service yang sama dengan Users
    auth: true
  },
  {
    path: '/api/layanan',
    target: process.env.LAYANAN_SERVICE_URL,
    auth: true
  }
];