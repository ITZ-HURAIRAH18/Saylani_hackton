import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DonationModal from "../components/Modal";

const CampaignDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [campaign, setCampaign] = useState(location.state?.campaign || null);
  const [loading, setLoading] = useState(!campaign);
  const [selectedCampaign, setSelectedCampaign] = useState(null); // for modal

  // Fetch campaign if not passed via state
  useEffect(() => {
    if (!campaign) {
      const fetchCampaign = async () => {
        try {
          // const res = await axiosInstance.get(`/campaigns/${id}`);
          const res = await axiosInstance.get(`campaigns/${id}`);
          setCampaign(res.data);
        } catch (err) {
          console.error("Error fetching campaign:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCampaign();
    } else {
      setLoading(false);
    }
  }, [id, campaign]);

  const getProgressPercentage = (raised, goal) => {
    return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = () => {
    if (campaign.endDate) {
      const now = new Date();
      const endDate = new Date(campaign.endDate);
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-4.438-1.709M3 13.5A8.5 8.5 0 0112 5a8.5 8.5 0 019 8.5" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Campaign not found</h3>
          <p className="text-gray-500">The campaign you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage(campaign.raisedAmount || 0, campaign.goalAmount || 0);
  const formattedDeadline = campaign.endDate
    ? new Date(campaign.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;
  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Back Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Campaigns
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Campaign Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 px-8 py-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {campaign.title}
                  </h1>
                  {campaign.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/20 text-white border border-white/30 ml-4">
                      {campaign.category}
                    </span>
                  )}
                </div>
                <p className="text-indigo-100 leading-relaxed text-sm">
                  {campaign.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="px-8 py-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Raised Amount */}
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(campaign.raisedAmount || 0)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Raised so far</div>
              </div>

              {/* Goal Amount */}
              <div className="text-center">
                <div className="text-xl font-bold text-gray-700 mb-1">
                  {formatCurrency(campaign.goalAmount || 0)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Our goal</div>
              </div>

              {/* Progress Percentage */}
              <div className="text-center md:text-right">
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  {progressPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-4">
              <div className="w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-center text-sm text-gray-600">
              {campaign.donorCount && (
                <span className="font-medium">{campaign.donorCount} supporter{campaign.donorCount !== 1 ? 's' : ''}</span>
              )}
              {campaign.donorCount && (campaign.createdAt || campaign.endDate) && <span className="mx-2">•</span>}
              {campaign.createdAt && (
                <span className="font-medium">
                  Started {new Date(campaign.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
              {campaign.endDate && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-medium">
                    Ends {formattedDeadline} ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="px-8 py-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ready to make a difference?
              </h3>
              <p className="text-gray-600 text-sm">
                Every contribution helps us get closer to our goal.
              </p>
            </div>

            {/* Donate Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setSelectedCampaign(campaign)}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Donate Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-medium">Secure and transparent donations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Impact Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Your Impact</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every donation directly contributes to achieving the campaign's mission. You'll receive updates on how your contribution is making a difference.
            </p>
          </div>

          {/* Trust & Safety Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trust & Safety</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              All campaigns are verified and monitored. Your donations are processed securely with full transparency on fund utilization.
            </p>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {selectedCampaign && (
        <DonationModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
