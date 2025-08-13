// src/middleware/auth.middleware.js
const axios = require('axios');

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

const verifyToken = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token tidak ditemukan." });
  }

  try {
    const responseAuth = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/verify-token`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (responseAuth.data?.valid) {
      // Teruskan informasi user ke service lain melalui header yang aman
      req.headers['x-user-info'] = JSON.stringify(responseAuth.data.user);
      return next();
    }
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Verifikasi token gagal.";
    return res.status(status).json({ message });
  }
};

module.exports = { verifyToken };