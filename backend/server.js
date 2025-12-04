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

// ✅ Initialize Express app FIRST
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev
  "http://localhost:5000",   // Express dev
  "https://ecommerce.netlify.app", // Netlify prod
  "https://e-commerce-frontend-gw9y.onrender.com" // Render static site
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookies());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/buyProduct", authMiddleware, buyProductRoutes);

// Connect DB
connectDB();

// ✅ Serve React build only in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/dist"); // Vite outputs to dist
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
