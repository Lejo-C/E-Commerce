import cart from '../Models/cart.js';
import express from 'express';
import authMiddleware from '../Middleware/auth.js';

const router = express.Router();

// Add to cart / update quantity
router.post('/addCart', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, price, name, image } = req.body;

  try {
    const existingCart = await cart.findOne({ userId });

    if (existingCart) {
      const productIndex = existingCart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex !== -1) {
        // Update quantity
        existingCart.products[productIndex].quantity += quantity;

        // Remove product if quantity <= 0
        if (existingCart.products[productIndex].quantity <= 0) {
          existingCart.products.splice(productIndex, 1);
        }
      } else {
        // Only add new product if quantity > 0
        if (quantity > 0) {
          existingCart.products.push({ productId, quantity, price, name, image });
        }
      }

      await existingCart.save();
      return res.status(200).json(existingCart);
    } else {
      // Create new cart if none exists
      if (quantity > 0) {
        const newCart = new cart({
          userId,
          products: [{ productId, quantity, price, name, image }],
        });
        await newCart.save();
        return res.status(201).json(newCart);
      } else {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart
router.get('/getCart', authMiddleware, async (req, res) => {
  try {
    const userCart = await cart
      .findOne({ userId: req.user._id })
      .populate('products.productId');

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove product from cart
router.delete('/removeFromCart', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const userCart = await cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = userCart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    userCart.products.splice(productIndex, 1);
    await userCart.save();

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
