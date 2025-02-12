import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true }, // Links to Applicant model
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Links to Job model
  applicationStatus: { 
    type: String, 
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Selected'], 
    default: 'Pending' 
  }, // Status tracking
  appliedAt: { type: Date, default: Date.now }, // When the application was submitted
  lastUpdated: { type: Date, default: Date.now }, // Last update on application
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
