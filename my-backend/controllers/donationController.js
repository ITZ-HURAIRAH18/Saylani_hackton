import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";

// Donor → donate
export const donateToCampaign = async (req, res) => {
  try {
    const { amount, message } = req.body;
    const { campaignId } = req.params; // ✅ get campaignId from URL

    // Check campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Create donation record
    const donation = new Donation({
      donor: req.user._id,
      campaign: campaignId,
      amount,
      message,
    });

    await donation.save();

    // Update raisedAmount in campaign
    campaign.raisedAmount += amount;
    await campaign.save();

    res.status(201).json({
      message: "Donation successful",
      donation,
      updatedCampaign: campaign,
    });
  } catch (err) {
    console.error("Donation Error:", err);
    res.status(500).json({ error: "Error processing donation" });
  }
};


// Donor → get their donations
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("campaign", "title goalAmount raisedAmount")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error("GetMyDonations Error:", err);
    res.status(500).json({ error: "Error fetching donations" });
  }
};

// NGO → see all donations for their campaign
export const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const donations = await Donation.find({ campaign: campaignId })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error("GetCampaignDonations Error:", err);
    res.status(500).json({ error: "Error fetching campaign donations" });
  }
};
