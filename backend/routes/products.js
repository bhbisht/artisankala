const express = require("express");
const prisma = require("../prismaClient");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET all products — public
router.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// GET products belonging to the logged-in user — protected
router.get("/mine", verifyToken, async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// SEARCH products — public
router.get("/search/:name", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: req.params.name,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// GET single product — public
router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// CREATE product — protected, owned by the logged-in user
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        category,
        userId: req.user.id,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// UPDATE product — protected, only the owner can edit
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own products" });
    }

    const { name, description, price, image, category } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(image && { image }),
        ...(category && { category }),
      },
    });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE product — protected, only the owner can delete
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;