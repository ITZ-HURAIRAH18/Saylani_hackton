import express from "express";
import { signup, login,verifyOtp } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.put("/change-password", protect, changePassword);

export default router;
