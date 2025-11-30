import cart from '../Models/cart.js';
import express from 'express';

const router = express.Router();

router.post('/addCart', async(req, res)=>{
    const userId = req.user._id;
    const {productId, quantity} = req.body;
    try{
        const existingCart = await cart.findOne({userId});
        if (existingCart) {
  const productIndex = existingCart.products.findIndex(p => p.productId.toString() === productId);
  if (productIndex !== -1) {
    existingCart.products[productIndex].quantity += quantity;
  } else {
    existingCart.products.push({ productId, quantity, price: req.body.price, name: req.body.name, image: req.body.image });
  }
  await existingCart.save();
  res.status(200).json(existingCart);
} else {
  const newCart = new cart({
    userId,
    products: [{ productId, quantity, price: req.body.price, name: req.body.name, image: req.body.image }]
  });
  await newCart.save();
  res.status(201).json(newCart);
}

    }catch(error){
        res.status(500).json({message: error.message});
    }
    }
);

router.get('/getCart', async(req, res)=>{
    const {userId} = req.query;
    try{
        const userCart = await cart.findOne({userId}).populate('products.productId');
        if(!userCart){
            return res.status(404).json({message: "Cart not found"});
        }
        res.status(200).json(userCart);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/removeFromCart', async(req, res)=>{
    const {userId, productId} = req.body;
    try{
        const userCart = await cart.findOne({userId});
        if(!userCart){
            return res.status(404).json({message: "Cart not found"});
        }
        const productIndex = userCart.products.findIndex(p => p.productId.toString() === productId);
        if(productIndex === -1){
            return res.status(404).json({message: "Product not found in cart"});
        }
        userCart.products.splice(productIndex, 1);
        await userCart.save();
        res.status(200).json(userCart);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


export default router;