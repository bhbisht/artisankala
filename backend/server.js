const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiter for Authentication Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 5 requests
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎉 ArtisanKala Backend API is Running!",
    endpoints: {
      allProducts: "/api/products",
      singleProduct: "/api/products/:id",
      search: "/api/products/search/:name",
      register: "/api/auth/register",
      login: "/api/auth/login",
    },
  });
});

// Routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

app.use("/api/products", productRoutes);

// Apply rate limiting ONLY to authentication routes
app.use("/api/auth", authLimiter, authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});