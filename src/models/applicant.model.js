import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  applicantId: { type: String, required: true, unique: true }, // Unique identifier for applicant
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure unique email
  phone: { type: String }, // Optional contact number
  department: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }, // Enum for better validation
  dob: { type: Date }, // Date of Birth
  address: { type: String }, // Optional address
  cgpa: { type: Number, min: 0, max: 10 }, // CGPA range validation
  resumeLink: { type: String }, // Link to applicant’s resume
  skills: [{ type: String }], // Array of skills
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }], // Reference to applications
}, { timestamps: true });

export const Applicant = mongoose.model('Applicant', applicantSchema);
