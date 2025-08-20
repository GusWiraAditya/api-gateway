import axios from 'axios';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const verifyToken = async (req, res, next) => {
  console.log("\n--- [MIDDLEWARE] Memulai verifikasi token ---");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("[AUTH] Gagal: Header Authorization tidak valid atau tidak ada.");
    return res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  const token = authHeader.split(" ")[1];
  const authServiceUrl = `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`;

  console.log(`[AUTH] Token ditemukan, menghubungi Auth Service di: ${authServiceUrl}`);

  try {
    const response = await axios.get(authServiceUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000,
    });

    if (response.status === 200 && response.data?.valid) {
      console.log("[AUTH] Sukses: Token valid.");
      req.userInfo = response.data.user;
      next();
    } else {
      console.warn("[AUTH] Gagal: Auth service merespon token tidak valid.");
      return res.status(401).json({ message: "Token tidak valid." });
    }
  } catch (error) {
    console.error("[AUTH] Terjadi error saat verifikasi token!");

    if (error.code === 'ECONNABORTED') {
      console.error("[AXIOS] Timeout: Koneksi ke Auth Service memakan waktu terlalu lama.");
      return res.status(504).json({ message: "Gateway Timeout: Tidak dapat menghubungi layanan autentikasi." });
    
    } else if (error.response) {
      console.error(`[AXIOS] Auth Service merespon dengan status ${error.response.status}:`, error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data?.message || "Token tidak valid atau terjadi error di Auth Service.",
      });

    } else {
      console.error("[AXIOS] Error jaringan atau setup:", error.message);
      return res.status(502).json({ message: "Bad Gateway: Terjadi masalah saat menghubungi layanan lain." });
    }
  }
};