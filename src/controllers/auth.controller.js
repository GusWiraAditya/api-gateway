
import axios from 'axios';

export const registerUser = async (req, res) => { 
  try {
    const { nickname, phone_number, email, password } = req.body;

    const authResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/register`, {
      username: nickname, phone_number, email, password
    });

    const credential_id = authResponse.data.credential_id;
    if (!credential_id) {
      return res.status(500).json({ message: "Auth service tidak mengembalikan credential_id" });
    }

    const userResponse = await axios.post(`${process.env.USER_SERVICE_URL}/api/users`, {
      ...req.body, credential_id
    });

    return res.status(201).json(userResponse.data);
  } catch (error) {
    console.error("Gateway Registration Error:", error.response ? error.response.data : error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Terjadi kesalahan pada proses registrasi.";
    return res.status(status).json({ message });
  }
};