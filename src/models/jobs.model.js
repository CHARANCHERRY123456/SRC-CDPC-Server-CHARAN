import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
    },
  company: {
    type: String,
    required: true
     },
  description: {
    type: String, 
    required: true 
    },
  location: { 
    type: String, 
    required: true 
    },
  salaryRange: { 
    type: String, 
    required: true 
    },
  postingDate: { 
    type: Date,
    default: Date.now 
    },
  deadline: {
    type: Date, 
    required: true
 }, // Add deadline field
},{timestamps:true}
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
