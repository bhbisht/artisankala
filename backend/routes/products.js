const express = require("express");

const router = express.Router();

let products = [
  {
    id: 1,
    name: "Handmade Pot",
    price: 500,
  },
  {
    id: 2,
    name: "Wooden Basket",
    price: 700,
  },
];

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  res.status(200).json(products);
});

// SEARCH PRODUCTS
router.get("/search/:name", (req, res) => {
  const result = products.filter((p) =>
    p.name.toLowerCase().includes(req.params.name.toLowerCase())
  );

  res.status(200).json(result);
});

// GET SINGLE PRODUCT
router.get("/:id", (req, res) => {
  const product = products.find(
    (p) => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(product);
});

// CREATE PRODUCT
router.post("/", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: "Name and price are required",
    });
  }

  const product = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(product);

  res.status(201).json(product);
});

// UPDATE PRODUCT
router.put("/:id", (req, res) => {
  const product = products.find(
    (p) => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;

  res.status(200).json(product);
});

// DELETE PRODUCT
router.delete("/:id", (req, res) => {
  const index = products.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  products.splice(index, 1);

  res.status(204).send();
});

module.exports = router;