require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const axios = require('axios');

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

const verifyToken = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({
        message: "Unauthorized: No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return response.status(401).json({
        message: "Unauthorized: Malformed token",
      });
    }

    const responseAuth = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/verify-token`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (responseAuth.data?.valid) {
      request.user = responseAuth.data.user;
      return next();
    } else {
      return response.status(403).json({
        message: "Unauthorized: invalid token",
      });
    }
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const errMsg = (
        error.response.data?.message ||
        error.response.data?.error ||
        ""
      ).toLowerCase();

      if (errMsg.includes("expired")) {
        return response.status(401).json({
          message: "Unauthorized: token expired",
        });
      }

      if (errMsg.includes("invalid")) {
        return response.status(403).json({
          message: "Unauthorized: invalid token",
        });
      }

      return response.status(status).json({
        message: error.response.data?.message || "Token verification failed",
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
      return response.status(503).json({
        message: "Authentication service unavailable",
      });
    } else {
      console.error("Error setting up request:", error.message);
      return response.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "api/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL,
    changeOrigin: true
  })
);

app.use(
  '/api/users',
  verifyToken,
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
  })
);
app.use(
  "/api/complaints",
  verifyToken,
  createProxyMiddleware({
    target: process.env.COMPLAINT_SERVICE_URL,
    changeOrigin: true,
  })
);
app.use(
  "/api/feedbacks",
  verifyToken,
  createProxyMiddleware({
    target: process.env.FEEDBACK_SERVICE_URL,
    changeOrigin: true,
  })
);

// Basic route for the gateway
app.get('/', (req, res) => {
  res.send('API Gateway for Microservices');
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Frontend can access all services via http://localhost:${PORT}/api/...`);
});
