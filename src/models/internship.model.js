import mongoose from "mongoose"

const internshipSchema = new mongoose.Schema({
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
  stipend: { 
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

const Internhip = mongoose.model('Internship', internshipSchema);

export default Internhip;
