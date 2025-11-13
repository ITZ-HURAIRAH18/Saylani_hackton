import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DonationModal from "../components/Modal";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axiosInstance.get("/campaigns/");
        const data = Array.isArray(res.data) ? res.data : res.data.campaigns || [];
        setCampaigns(data);

        // dynamic categories
        const uniqueCategories = [...new Set(data.map(c => c.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (category ? c.category.toLowerCase() === category.toLowerCase() : true)
  );

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
const formatDate = (dateStr) => {
  if (!dateStr) return "No deadline";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Browse Campaigns</h1>
              <p className="text-neutral-300 text-sm mt-1">Support causes you care about</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right text-sm text-neutral-300">
                <div className="font-semibold">{campaigns.length}</div>
                <div>Total Campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Our Story Section */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-xl p-8 md:p-12 mb-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-lg md:text-xl text-neutral-200 mb-6 leading-relaxed">
              FundHub is a platform dedicated to connecting passionate donors with meaningful causes. 
              We believe that every contribution, no matter how small, can create a ripple effect of positive change 
              in communities around the world.
            </p>
            <p className="text-base md:text-lg text-neutral-200 leading-relaxed">
              Through transparent fundraising and real-time tracking, we empower NGOs to share their stories 
              and donors to make informed decisions. Together, we're building a future where compassion 
              and action go hand in hand.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">100% Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Secure Donations</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold">Real Impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Donate Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Live Donations</h2>
              <p className="text-neutral-600">See real-time contributions making a difference</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-200 rounded-full">
              <div className="w-3 h-3 bg-neutral-700 rounded-full animate-pulse"></div>
              <span className="text-neutral-800 font-semibold text-sm">Live</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 border border-neutral-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Total Donations</h3>
                <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-neutral-800 mb-2">
                {formatCurrency(campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0))}
              </p>
              <p className="text-sm text-neutral-600">Raised across all campaigns</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 border border-neutral-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Active Campaigns</h3>
                <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-neutral-800 mb-2">{campaigns.length}</p>
              <p className="text-sm text-neutral-600">Campaigns you can support</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-6 border border-neutral-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Donors Today</h3>
                <svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-neutral-800 mb-2">
                {Math.floor(Math.random() * 50) + 20}
              </p>
              <p className="text-sm text-neutral-600">Active contributors</p>
            </div>
          </div>
        </div>

        {/* Compact Search + Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Results Count - Inline */}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map(c => {
              const progressPercentage = getProgressPercentage(c.raisedAmount || 0, c.goalAmount || 0);
              
              return (
                <div key={c._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:-translate-y-2">
                  {/* Campaign Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-neutral-700 transition-colors duration-200">
                          {c.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {c.description}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
  Deadline: <span className="font-medium text-gray-900">{formatDate(c.deadline)}</span>
</p>

                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-800 border border-neutral-300">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {c.category}
                      </span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="px-6 pb-6">
                    <div className="space-y-3">
                      {/* Amount Info */}
                      <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(c.raisedAmount || 0)}
                          </span>
                          <span className="text-gray-500">
                            of {formatCurrency(c.goalAmount || 0)}
                          </span>
                      </div>

                      {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-neutral-700 to-neutral-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                      </div>

                      {/* Progress Percentage */}
                      <div className="text-right">
                          <span className="text-sm font-medium text-neutral-700">
                          {progressPercentage.toFixed(1)}% funded
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6 flex gap-3">
                    <Link
                      to={`/campaign/${c._id}`}
                      state={{ campaign: c }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-neutral-400 text-neutral-700 rounded-xl hover:bg-neutral-100 transition-all duration-200 font-medium group"
                    >
                      <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedCampaign(c)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white rounded-xl hover:from-neutral-800 hover:to-neutral-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Donate Now
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-4.438-1.709M3 13.5A8.5 8.5 0 0112 5a8.5 8.5 0 019 8.5" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-6">
                  {search || category 
                    ? "Try adjusting your search criteria to find more campaigns." 
                    : "There are no campaigns available at the moment."}
                </p>
                {(search || category) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                    }}
                    className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
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

export default Campaigns;