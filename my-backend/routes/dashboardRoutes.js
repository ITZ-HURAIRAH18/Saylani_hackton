import express from "express";
import {
  getNgoDashboard,
  getDonorDashboard,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// NGO Dashboard
router.get("/ngo", protect, getNgoDashboard);

// Donor Dashboard
router.get("/donor", protect, getDonorDashboard);

export default router;
