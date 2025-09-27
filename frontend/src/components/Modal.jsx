import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";   // ⬅️ Import this

const DonationModal = ({ campaign, onClose }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const userId = useSelector((state) => state.user.id);
  if (!campaign) return null; // safety check

  const handleDonate = async () => {
    setIsLoading(true);
    try {
       console.log("User ID:", userId);
      await axiosInstance.post(`/donations/${campaign._id}/donate`, { amount, message });

      alert("Donation successful 🎉");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error donating!");
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Make a Donation</h2>
                <p className="text-indigo-100 text-sm">Support this amazing cause</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {campaign.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Goal: {formatCurrency(campaign.goalAmount || 0)}</span>
            <span>Raised: {formatCurrency(campaign.raisedAmount || 0)}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((campaign.raisedAmount || 0) / (campaign.goalAmount || 1) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    amount === quickAmount.toString()
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Custom Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">₹</span>
              </div>
              <input
                type="number"
                placeholder="Enter your amount"
                className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>
            {amount && (
              <p className="mt-2 text-sm text-gray-600">
                You're donating: <span className="font-semibold text-indigo-600">{formatCurrency(Number(amount) || 0)}</span>
              </p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <div className="relative">
              <textarea
                placeholder="Share why this cause matters to you..."
                className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {message.length}/200
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Secure Donation</p>
                <p className="text-xs text-green-600">Your transaction is protected and secure</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleDonate}
              disabled={!amount || isLoading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Donate {amount && formatCurrency(Number(amount))}</span>
                </div>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

export default DonationModal;