import express, { application } from "express";
import authMiddleware from "../Middleware/auth.js";
import Product from "../Models/products.js";   // 👈 must exist and be imported
import Order from "../Models/order.js";

const router = express.Router();

router.post("/buyProduct", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newOrder = new Order({
      userId: req.user._id,        // 👈 buyer
      productId: product._id,      // 👈 product
      merchantId: product.merchantId, // 👈 merchant who owns product
      quantity,
      totalPrice: product.price * quantity,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
