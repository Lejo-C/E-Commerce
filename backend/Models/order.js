import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // buyer
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // seller (optional for now)
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    buyerName: { type: String },
    buyerEmail: { type: String },
    buyerPhone: { type: String },
    buyerAddress: { type: String },
    status: {
      type: String,
      enum: ["Confirmed", "Shipped", "Delivered", "Canceled"],
      default: "Confirmed"
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
