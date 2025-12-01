import jwt from "jsonwebtoken";
import User from "../Models/User.js"; // adjust path

const authMiddleware = async (req, res, next) => {
  let token;

  // Check cookie first
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }
  // Fallback: check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object (optional: fetch from DB)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
