import express from "express";
import authMiddleware from "../Middleware/auth.js";
import Product from "../Models/products.js";
import Order from "../Models/order.js";

const router = express.Router();

// Buy a single product
router.post("/buyProduct", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, buyerName, buyerEmail, buyerPhone, buyerAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newOrder = new Order({
      userId: req.user._id,
      productId: product._id,
      merchantId: product.merchantId,
      quantity,
      totalPrice: product.price * quantity,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buy all items from cart
router.post("/buyAll", authMiddleware, async (req, res) => {
  try {
    const { items, buyerName, buyerEmail, buyerPhone, buyerAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to purchase" });
    }

    const orders = [];

    // Create an order for each item
    for (const item of items) {
      const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;

      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Product ${productId} not found, skipping...`);
        continue;
      }

      const newOrder = new Order({
        userId: req.user._id,
        productId: product._id,
        merchantId: product.merchantId,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress,
      });

      await newOrder.save();
      orders.push(newOrder);
    }

    res.status(201).json({
      message: "Orders placed successfully",
      orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for the logged-in user
router.get("/myOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (for merchants)
router.put("/updateOrderStatus/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Confirmed", "Shipped", "Delivered", "Canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId).populate('productId');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the logged-in user is the merchant who owns this product
    if (order.merchantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (for buyers)
router.put("/cancelOrder/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the logged-in user is the owner of the order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Check if order can be canceled
    if (["Shipped", "Delivered", "Canceled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be canceled at this stage" });
    }

    order.status = "Canceled";
    await order.save();

    res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
