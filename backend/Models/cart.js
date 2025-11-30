import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ productId:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: {type:Number, default:1},
        price: {type:Number, required:true},
        name: {type:String, required:true},
        image: {type:String}
   }],
});

export default mongoose.model('Cart', cartSchema);