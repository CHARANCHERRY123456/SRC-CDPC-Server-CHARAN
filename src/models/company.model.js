import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  industry: { type: String },
  locations: [String],
  website: { type: String }, // Company's official website
  headquarters: { type: String }, // HQ location
  logo: { type: String }, // URL for the company's logo
  contactDetails: {
    email: { type: String },
    phone: { type: String },
  },
  hiringPattern: {
    preferredSkills: [String], // Skills commonly sought by the company
    preferredDepartments: [String], // Departments frequently hired (e.g., "Computer Science", "Mechanical")
  },
  placementStats: {
    totalHired: { type: Number, default: 0 }, // Total number of students hired
    avgSalary: { type: Number }, // Average salary offered by the company
    highestSalary: { type: Number }, // Highest salary offered
    lowestSalary: { type: Number }, // Lowest salary offered
  },
  alumniProfiles: [
    {
      name: { type: String },
      position: { type: String }, // Current role of the alumni
      linkedin: { type: String },
      batchYear: { type: Number }, // Alumni's graduating year
    },
  ],
  interviewExperiences: [
    {
      person: { type: String },
      comment: { type: String },
      linkedin: { type: String },
      date: { type: Date }, // Date of the interview experience
      rounds: [
        {
          roundNumber: { type: Number },
          description: { type: String }, // Description of the round
          difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }, // Difficulty level
        },
      ],
    },
  ],
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
