// src/controllers/auth.controller.js
const axios = require('axios');

const registerUser = async (req, res) => {
  try {
    // === Langkah 1: Panggil Auth Service ===
    const { nickname, phone_number, email, password } = req.body;
    const authPayload = { username: nickname, phone_number, email, password };
    const authResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/auth/register`, authPayload);
    
    const credential_id = authResponse.data.credential_id;
    if (!credential_id) {
      return res.status(500).json({ message: "Auth service tidak mengembalikan credential_id" });
    }

    // === Langkah 2: Panggil User Service ===
    const userPayload = { ...req.body, credential_id };
    const userResponse = await axios.post(`${process.env.USER_SERVICE_URL}/users`, userPayload);
    
    // === Langkah 3: Kembalikan Respon Sukses ===
    return res.status(201).json(userResponse.data);
  } catch (error) {
    console.error("Gateway Registration Error:", error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Terjadi kesalahan pada proses registrasi.";
    return res.status(status).json({ message });
  }
};

module.exports = { registerUser };