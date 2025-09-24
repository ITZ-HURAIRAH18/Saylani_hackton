import express from "express";
import {
  donateToCampaign,
  getMyDonations,
  getCampaignDonations,
} from "../controllers/donationController.js";
import { protect } from "../middleware/authMiddleware.js";  // ✅ ensure folder is "middleware"

const router = express.Router();

// Donor → donate
// router.post("/", protect, donateToCampaign);
router.post("/:campaignId/donate", protect, donateToCampaign);
// Donor → view their donations
router.get("/my", protect, getMyDonations);

// NGO → view all donations for a specific campaign
router.get("/campaign/:campaignId", protect, getCampaignDonations);

export default router;
