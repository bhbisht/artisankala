const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const { generateProductDescription } = require("../services/huggingfaceService");

const router = express.Router();

// POST /api/ai/generate-description
router.post("/generate-description", verifyToken, async (req, res) => {
  try {
    const { name, category, material, features } = req.body;

    if (!name || !category || !material || !features) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const description = await generateProductDescription(name, category, material, features);

    return res.status(200).json({
      success: true,
      message: "Product description generated successfully.",
      description,
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    const isTimeout = error.message?.includes("timed out");
    const isRateLimit = error.message?.toLowerCase().includes("rate limit") || error.status === 429;

    return res.status(isRateLimit ? 429 : isTimeout ? 504 : 500).json({
      success: false,
      message: isRateLimit
        ? "AI service is rate-limited right now. Please try again shortly."
        : error.message || "Failed to generate product description.",
    });
  }
});

module.exports = router;
