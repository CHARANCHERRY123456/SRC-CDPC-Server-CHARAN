import mongoose from "mongoose";

const EventRegistrationSchema = new mongoose.Schema({
    eventId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        index:true,
        required: true 
    }, // Reference to Event
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    feedback: { type: String }, // Optional
    registrationDate: { type: Date, default: Date.now }, // Timestamp for registration
  },{timestamps:true}
);
  
const EventRegistration =  mongoose.model('EventRegistration', EventRegistrationSchema);

export {EventRegistration}
  