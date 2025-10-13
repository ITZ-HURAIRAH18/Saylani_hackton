import express from "express";
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  addDonation,
   getCampaignById,
} from "../controllers/campaignController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// NGO APIs
router.post("/", protect, createCampaign);
router.put("/:id", protect, updateCampaign);
router.delete("/:id", protect, deleteCampaign);

// Donor APIs
// router.get("/", getCampaigns);
// router.post("/:id/donate", protect, addDonation);
router.get("/", getCampaigns);
router.post("/:id/donate", protect, addDonation);
router.get("/:id", getCampaignById);
export default router;
