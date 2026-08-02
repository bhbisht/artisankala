const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authLimiter = require("./middleware/rateLimiter");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ArtisanKala Backend API is running",
    endpoints: {
      allProducts: "/api/products",
      singleProduct: "/api/products/:id",
      search: "/api/products/search/:name",
      register: "/api/auth/register",
      login: "/api/auth/login",
      aiDescription: "/api/ai/generate-description",
    },
  });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});