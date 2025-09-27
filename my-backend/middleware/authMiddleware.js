import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if expired
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    res.status(401).json({ message: "Token invalid" });
  }
};

export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};