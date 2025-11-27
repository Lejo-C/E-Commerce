import express from "express";
import connectDB from "./DataBase/db.js";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/products.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Connect DB
// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
