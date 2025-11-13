import Campaign from "../models/Campaign.js";

// NGO → Create Campaign

export const createCampaign = async (req, res) => {
  try {
    console.log("Create campaign request received:", {
      body: req.body,
      user: req.user ? { id: req.user.id, email: req.user.email } : "No user",
    });

    const { title, description, category, goalAmount, deadline } = req.body;

    // Validate required fields
    if (!title || !description || !goalAmount || !deadline) {
      const missing = [];
      if (!title) missing.push("title");
      if (!description) missing.push("description");
      if (!goalAmount) missing.push("goalAmount");
      if (!deadline) missing.push("deadline");
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(", ")}` 
      });
    }

    // Validate goalAmount is a number
    if (isNaN(goalAmount) || Number(goalAmount) <= 0) {
      return res.status(400).json({ message: "Goal amount must be a positive number" });
    }

    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date" });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newCampaign = new Campaign({
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || "",
      goalAmount: Number(goalAmount),
      raisedAmount: 0,
      createdBy: req.user.id,
      deadline: deadlineDate,
    });

    const savedCampaign = await newCampaign.save();
    console.log("Campaign created successfully:", savedCampaign._id);
    
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error in createCampaign:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }

    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
};


// NGO → Update Campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert deadline to Date if provided
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, createdBy: req.user.id }, // only NGO owner can edit
      updateData,
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
      createdBy: req.user.id,
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
