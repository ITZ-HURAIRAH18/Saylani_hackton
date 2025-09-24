// models/Campaign.js
import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deadline: { type: Date, required: true }, // <-- New field
}, { timestamps: true });

export default mongoose.model("Campaign", campaignSchema);
