import express from "express";
import Product from "../Models/products.js";  // ✅ Capital P

const router = express.Router();

// Create product
router.post("/createProduct", async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image
    });
    const data = Array.isArray(newProduct) ? newProduct : [newProduct];
    const product = await Product.insertMany(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/getProduct", async (req, res) => {
  try {
    const products = await Product.find();   // ✅ use Product
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get("/getProduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // ✅ use Product
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete product by ID
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" }); // ✅ add return
    }

    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
