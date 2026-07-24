import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    logger.warn(`Invalid or expired token: ${err.message}`);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
