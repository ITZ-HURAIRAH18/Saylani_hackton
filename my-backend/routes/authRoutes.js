import express from "express";
import { signup, login, verifyOtp, verifyEmail, resendVerificationOTP } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationOTP);
router.post("/verify-otp", verifyOtp);
router.put("/change-password", protect, changePassword);

export default router;
