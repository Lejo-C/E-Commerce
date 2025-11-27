import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") }); // load .env from project root

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // must match .env key
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

// connectDB(); // Removed to prevent auto-execution on import

export default connectDB;
