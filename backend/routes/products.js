const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// SEARCH PRODUCTS
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

// GET SINGLE PRODUCT
router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// CREATE PRODUCT
router.post("/", async (req, res, next) => {
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
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// UPDATE PRODUCT
router.put("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.status(200).json(product);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    next(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    next(err);
  }
});

module.exports = router;