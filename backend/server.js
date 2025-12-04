import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import cookies from "cookie-parser";

import connectDB from "./DataBase/db.js";
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/products.js";
import cartRoutes from "./Routes/cart.js";
import buyProductRoutes from "./Routes/buyProduct.js";
import authMiddleware from "./Middleware/auth.js";

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev
  "http://localhost:5000",   // Express serving frontend locally
  "https://e-commerce-7ep5.onrender.com" // Render deployment
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(cookies());
app.use(express.json());

// API Routes - BEFORE static file serving
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);  // No global auth middleware - routes handle it individually
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/buyProduct", authMiddleware, buyProductRoutes);

// Connect to MongoDB
connectDB();

// Serve React build (production only)
const buildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(buildPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
