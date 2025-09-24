import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";

// NGO Dashboard → list campaigns + donations
export const getNgoDashboard = async (req, res) => {
  try {
    // NGO can only see their own campaigns
    const campaigns = await Campaign.find({ createdBy: req.user._id });

    // fetch donations for these campaigns
    const campaignIds = campaigns.map(c => c._id);
    const donations = await Donation.find({ campaign: { $in: campaignIds } })
      .populate("donor", "name email")
      .populate("campaign", "title");

    res.json({
      campaigns,
      donations,
    });
  } catch (err) {
    console.error("NGO Dashboard Error:", err);
    res.status(500).json({ error: "Error fetching NGO dashboard data" });
  }
};

// Donor Dashboard → list donation history
export const getDonorDashboard = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("campaign", "title goalAmount raisedAmount")
      .sort({ createdAt: -1 });

    res.json({ donations });
  } catch (err) {
    console.error("Donor Dashboard Error:", err);
    res.status(500).json({ error: "Error fetching donor dashboard data" });
  }
};
