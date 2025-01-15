import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    details: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: Number, required: true }, // Maximum participants
    registeredCount: { type: Number, default: 0 }, // Tracks the number of registrations
  },{timestamps:true}
);

const Event = mongoose.model('Event', EventSchema);
export default Event;
  