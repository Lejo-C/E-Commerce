import express from "express";
import Product from "../Models/products.js";   // ✅ Product model
import Order from "../Models/order.js";        // ✅ Import Order model
import authMiddleware from "../Middleware/auth.js"; // ✅ Protect routes

const router = express.Router();

// Create product (merchant only)
router.post("/addProduct", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      merchantId: req.user._id, // 👈 attach merchant ID from JWT
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/getProduct", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get("/getProduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product by ID (merchant only)
router.delete("/deleteProduct/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get merchant's orders
router.get("/merchantOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ merchantId: req.user._id })
      .populate("productId")
      .populate("userId", "name email"); // buyer info
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In products.js
router.get("/merchantProducts", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ merchantId: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
