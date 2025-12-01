import mongoose from "mongoose";

const buyProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

export default mongoose.model("BuyProduct", buyProductSchema);