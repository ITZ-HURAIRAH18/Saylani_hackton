import Campaign from "../models/Campaign.js";

// NGO → Create Campaign

export const createCampaign = async (req, res) => {
  try {
    const { title, description, category, goalAmount, deadline } = req.body;

    if (!title || !description || !goalAmount || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCampaign = new Campaign({
      title,
      description,
      category,
      goalAmount,
      raisedAmount: 0,
      createdBy: req.user.id, // assuming `protect` middleware sets req.user
      deadline: new Date(deadline), // ensure it's stored as a Date
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error in createCampaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// NGO → Update Campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, ngo: req.user._id }, // only NGO owner can edit
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found or unauthorized" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Error updating campaign" });
  }
};

// NGO → Delete Campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findOneAndDelete({
      _id: id,
      ngo: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found or unauthorized" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting campaign" });
  }
};

// Donor → Browse/Search Campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find(); // Fetch all campaigns
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign by id:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Auto-update raisedAmount when donation happens
export const addDonation = async (req, res) => {
  try {
    const { id } = req.params; // campaignId
    const { amount } = req.body;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { $inc: { raisedAmount: amount } },
      { new: true }
    );

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Error updating donation" });
  }
};
