import express from "express";
import connectDB from "./DataBase/db.js";
import cors from "cors";
import cookies from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/products.js";
import authMiddleware from "./Middleware/auth.js";
import cartRoutes from "./Routes/cart.js";
import buyProductRoutes from "./Routes/buyProduct.js";

// Load environment variables
dotenv.config();

// Fix __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS options
const corsOptions = {
  origin: "http://localhost:5173",   // frontend dev URL
  credentials: true,                 // allow cookies/authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
const isDev = process.env.NODE_ENV !== "production";
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookies());
app.use(express.json());

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/buyProduct", authMiddleware, buyProductRoutes);

// Connect DB
connectDB();

// ---------- Serve React build in production ----------
if (!isDev) {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));

  // SPA fallback: serve index.html for non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(buildPath, "index.html"));
  });
}
// -----------------------------------------------------

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
