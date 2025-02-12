import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  placementYear: { type: Number, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant", required: true },
  status: { type: String, enum: ["Selected", "Rejected", "Pending"], required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  jobRole: { type: String, required: true },
  packageOffered: { type: Number, required: true }
},{timestamps:true});

export const Placement = mongoose.model("Placement", PlacementSchema);


