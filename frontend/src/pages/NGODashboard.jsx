import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { showToast } from "../utils/toast";

const NGODashboard = () => {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState("");
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    deadline: "",
  });


  
  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/ngo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response:", res.data); // check structure
      // If API returns { campaigns: [...] }, use res.data.campaigns
      setCampaigns(
        Array.isArray(res.data) ? res.data : res.data.campaigns || []
      );
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [token]);

  
  // Handle donations fetch
  const handleViewDonations = async (campaignId, campaignTitle) => {
    try {
      const res = await axiosInstance.get(`/donations/campaign/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Donations API response:", res.data); // check structure

      // Make sure donations is always an array
      setDonations(
        Array.isArray(res.data) ? res.data : res.data.donations || []
      );
      setSelectedCampaign(campaignId);
      setSelectedCampaignTitle(campaignTitle);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.goalAmount || !formData.deadline) {
        showToast("Please fill in all required fields (title, description, goal amount, deadline)", "warning");
        setIsLoading(false);
        return;
      }

      // Ensure goalAmount is a number
      const campaignData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category?.trim() || "",
        goalAmount: Number(formData.goalAmount),
        deadline: formData.deadline,
      };

      console.log("Creating campaign with data:", campaignData);
      console.log("Token:", token ? "Present" : "Missing");
      console.log("Full URL will be: http://localhost:5000/api/campaigns/");

      const response = await axiosInstance.post("/campaigns/", campaignData);

      console.log("Campaign created successfully:", response.data);

      setShowModal(false);
      setFormData({ title: "", description: "", category: "", goalAmount: "", deadline: "" });
      setIsEditMode(false);
      setEditingCampaignId(null);
      fetchCampaigns(); // refresh list
      showToast("Campaign created successfully!", "success");
    } catch (err) {
      console.error("Error creating campaign:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });

      let errorMessage = "Error creating campaign. Please try again.";
      
      if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
        errorMessage = "Network error: unable to reach the server. Please confirm the backend is running.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid data. Please check all fields.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCampaign = (campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category || "",
      goalAmount: campaign.goalAmount,
      deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().split('T')[0] : "",
    });
    setIsEditMode(true);
    setEditingCampaignId(campaign._id);
    setShowModal(true);
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ensure goalAmount is a number
      const campaignData = {
        ...formData,
        goalAmount: Number(formData.goalAmount),
      };

      await axiosInstance.put(`/campaigns/${editingCampaignId}`, campaignData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      setFormData({ title: "", description: "", category: "", goalAmount: "", deadline: "" });
      setIsEditMode(false);
      setEditingCampaignId(null);
      fetchCampaigns(); // refresh list
      showToast("Campaign updated successfully!", "success");
    } catch (err) {
      console.error("Error updating campaign:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error updating campaign. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId, campaignTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${campaignTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCampaigns(); // refresh list
      showToast("Campaign deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting campaign:", err);
      showToast("Error deleting campaign. Please try again.", "error");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingCampaignId(null);
    setFormData({ title: "", description: "", category: "", goalAmount: "", deadline: "" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised, goal) => {
    return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  };

  const getTotalStats = () => {
    const totalRaised = campaigns.reduce(
      (sum, campaign) => sum + (campaign.raisedAmount || 0),
      0
    );
    const totalGoal = campaigns.reduce(
      (sum, campaign) => sum + (campaign.goalAmount || 0),
      0
    );
    const activeCampaigns = campaigns.filter(
      (c) => (c.raisedAmount || 0) < (c.goalAmount || 0)
    ).length;
    return { totalRaised, totalGoal, activeCampaigns };
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { totalRaised, totalGoal, activeCampaigns } = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
              <p className="text-neutral-300">
                Manage your campaigns and track donations
              </p>
            </div>
            <button
              onClick={() => {
                setIsEditMode(false);
                setEditingCampaignId(null);
                setFormData({ title: "", description: "", category: "", goalAmount: "", deadline: "" });
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Helpful Information Section */}
        <div className="bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-150 rounded-2xl shadow-lg border border-neutral-300 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Getting Started Guide</h2>
              <p className="text-gray-600">Tips and best practices for successful fundraising</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Compelling Campaigns</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Write clear, emotional stories. Include specific goals and explain how donations will be used. 
                Add a realistic deadline to create urgency.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Progress</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor donations in real-time. View detailed donor information and update your campaign 
                description as you reach milestones.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Engage with Donors</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Respond to donations with gratitude. Share updates on how funds are being used. 
                Transparency builds trust and encourages more donations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Realistic Deadlines</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose deadlines that give donors enough time to contribute while maintaining urgency. 
                You can always extend deadlines if needed.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keep Campaigns Updated</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Edit your campaigns to reflect current needs. Update descriptions, adjust goals, 
                or extend deadlines based on your progress and donor feedback.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparent Fundraising</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Be clear about how funds will be used. Donors appreciate transparency and are more 
                likely to contribute when they understand the impact of their donation.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Raised
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRaised)}
                </p>
              </div>
              <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCampaigns}
                </p>
              </div>
              <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Campaigns
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Campaigns
          </h2>
          {campaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first campaign to start raising funds for your
                cause.
              </p>
              
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setEditingCampaignId(null);
                  setFormData({ title: "", description: "", category: "", goalAmount: "", deadline: "" });
                  setShowModal(true);
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white font-semibold rounded-xl hover:from-neutral-800 hover:to-neutral-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-neutral-700 transition-colors duration-200 flex-1">
                        {campaign.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        {campaign.category && (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-neutral-200 text-neutral-800">
                            {campaign.category}
                          </span>
                        )}
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                          title="Edit Campaign"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCampaign(campaign._id, campaign.title)}
                          className="p-2 text-gray-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                          title="Delete Campaign"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {campaign.description}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      Deadline:{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(campaign.deadline)}
                      </span>
                    </p>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(campaign.raisedAmount || 0)}
                        </span>
                        <span className="text-gray-500">
                          of {formatCurrency(campaign.goalAmount || 0)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neutral-700 to-neutral-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${getProgressPercentage(
                              campaign.raisedAmount || 0,
                              campaign.goalAmount || 0
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="text-right mt-1">
                        <span className="text-xs font-medium text-neutral-700">
                          {getProgressPercentage(
                            campaign.raisedAmount || 0,
                            campaign.goalAmount || 0
                          ).toFixed(1)}
                          % funded
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleViewDonations(campaign._id, campaign.title)
                      }
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white font-medium rounded-xl hover:from-neutral-800 hover:to-neutral-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Donations
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donations Table */}
        {selectedCampaign && (
          <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Donations
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedCampaignTitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {donations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No donations yet
                </h3>
                <p className="text-gray-500">
                  This campaign hasn't received any donations yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation, index) => (
                      <tr
                        key={donation._id}
                      className={`hover:bg-neutral-100 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white/60" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center mr-3">
                              <svg
                              className="w-5 h-5 text-neutral-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {donation.donor?.name || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {donation.donor?.email || ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {formatCurrency(donation.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">
                              {new Date(donation.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(donation.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {isEditMode ? "Edit Campaign" : "Create New Campaign"}
                  </h2>
                  <p className="text-neutral-300 text-sm">
                    {isEditMode
                      ? "Update your campaign details"
                      : "Launch your fundraising campaign"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={isEditMode ? handleUpdateCampaign : handleCreateCampaign} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter campaign title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your campaign and its impact"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Education, Health, Environment"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Goal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    name="goalAmount"
                    placeholder="Enter target amount"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white rounded-xl hover:from-neutral-800 hover:to-neutral-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </div>
                  ) : (
                    isEditMode ? "Update Campaign" : "Create Campaign"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NGODashboard;
