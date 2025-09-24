import { useState } from "react";
import DonationModal from "./DonationModal";

const CampaignCard = ({ campaign, user }) => {
  const [open, setOpen] = useState(false);

  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-80">
      <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
      <p className="text-gray-600 mb-2">{campaign.description}</p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        Raised: ₹{campaign.raisedAmount} / ₹{campaign.goalAmount}
      </p>

      {/* Donor → show Donate button */}
      {user?.role === "donor" && (
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Donate
        </button>
      )}

      {/* Modal */}
      {open && (
        <DonationModal campaign={campaign} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default CampaignCard;
