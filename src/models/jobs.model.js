import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Job title
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company schema
    location: { type: String, required: true }, // Job location
    locationType: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'], // Specifies the type of work environment
      required: true,
    },
    salaryRange: { type: String, required: true }, // Expected salary range
    requiredSkills: [String], // Array of skills required for the job
    jobDescription: { type: String, required: true }, // Detailed job description
    eligibilityCriteria: { type: String }, // Optional: Specific eligibility criteria (e.g., CGPA >= 8.0)
    batch: [String], // Specify eligible batches, e.g., ["2024", "2025"]
    branches: [String], // Specify eligible branches, e.g., ["CSE", "ECE"]
    postingDate: { type: Date, default: Date.now }, // Auto-set posting date
    deadline: { type: Date, required: true }, // Application deadline
    recruitmentProcess: [
      {
        round: { type: Number, required: true }, // Round number (e.g., 1 for Aptitude Test)
        description: { type: String, required: true }, // Round description
        date: { type: Date }, // Optional: Date of the specific round
      },
    ],
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship'], // Job type: Full-time or Internship
      required: true,
    },
    contactEmail: { type: String, required: true }, // Contact email for queries
    isActive: { type: Boolean, default: true }, // Is the job currently active
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
