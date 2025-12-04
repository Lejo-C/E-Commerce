import express from "express";
import Product from "../Models/products.js";       // Product model
import Order from "../Models/order.js";            // Order model
import authMiddleware from "../Middleware/auth.js"; // Protect routes

const router = express.Router();

/**
 * @route   POST /api/products/addProduct
 * @desc    Create a new product (merchant only)
 */
router.post("/addProduct", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      merchantId: req.user._id, // attach merchant ID from JWT
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/products/getProduct
 * @desc    Get all products
 */
router.get("/getProduct", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/products/getProduct/:id
 * @desc    Get product by ID
 */
router.get("/getProduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/products/deleteProduct/:id
 * @desc    Delete product by ID (merchant only)
 */
router.delete("/deleteProduct/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/products/updateProduct/:id
 * @desc    Update product by ID (merchant only)
 */
router.put("/updateProduct/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the user is the owner of the product
    if (product.merchantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/products/merchantOrders
 * @desc    Get merchant's orders
 */
router.get("/merchantOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ merchantId: req.user._id })
      .populate("productId")
      .populate("userId", "name email"); // buyer info
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get merchant orders error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/products/merchantProducts
 * @desc    Get products created by the merchant
 */
router.get("/merchantProducts", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ merchantId: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Get merchant products error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
