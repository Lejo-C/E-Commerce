import express from "express";
import connectDB from "./DataBase/db.js";
import cors from "cors";
import cookies from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/products.js";
import authMiddleware from "./Middleware/auth.js";
import cartRoutes from "./Routes/cart.js";
import buyProductRoutes from "./Routes/buyProduct.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors({origin:"http://localhost:5173", credentials:true}));
app.use(cookies());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/products", authMiddleware,productRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/buyProduct", authMiddleware, buyProductRoutes);

// Connect DB
// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
