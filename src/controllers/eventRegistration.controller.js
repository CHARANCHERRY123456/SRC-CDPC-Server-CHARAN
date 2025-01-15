import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { EventRegistration } from "../models/eventRegistration.model.js";
import Event from "../models/event.model.js";

// Create a new event registration
const createRegistration = asyncHandler(async (req, res) => {
  const { eventId, fullName, email, phone, feedback } = req.body;
  console.log(req.body);
  // Validate input
  if (!eventId || !fullName || !email || !phone) {
    // return res.status(400).json({ message: "All required fields must be provided." });
    throw new ApiError(400,"All required fields must be provided");
  }

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(400,"Event not found");
  }
 // Check if the event has capacity
 if (event.registeredCount >= event.capacity) {
    throw new ApiError(400, "Event is fully booked.");
  }

  // Create a new registration
  const registration = await EventRegistration.create({
    eventId,
    fullName,
    email,
    phone,
    feedback,
  });


  // Increment the registration count for the event
  event.registeredCount += 1;
  await event.save();

  if(!registration){
    throw new ApiError(500,"Something went wrong while registering");
  }

  res.status(201).json(new ApiResponse(201,registration,"Registration Successful"))
});

// Get all registrations
const getAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find().populate("eventId");
  res.status(200).json({
    message: "Registrations fetched successfully.",
    data: registrations,
  });
});

// Get registrations by event ID
const getRegistrationsByEventId = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const registrations = await EventRegistration.find({ eventId }).populate(
    "eventId",
    "title date venue"
  );

  if (!registrations.length) {
   throw new ApiError(404,"No Registrations found for this Event")
  }

return res.status(200).json(new ApiResponse(200,registrations,"Registartions fetched Successfully"));
});

// Update a registration
const updateRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, feedback } = req.body;

  // Find and update the registration
  const updatedRegistration = await EventRegistration.findByIdAndUpdate(
    id,
    { fullName, email, phone, feedback },
    { new: true }
  );

  if (!updatedRegistration) {
    throw new ApiError(404,"Registration not found.");
  }

  res.status(200).json(new ApiResponse(200,updateRegistration,"Registration updated successfully."));
});

// Delete a registration
const deleteRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedRegistration = await EventRegistration.findByIdAndDelete(id);

  if (!deletedRegistration) {
    throw new ApiError(404,"Registration not found");
  }

return res.status(200).json(200,deleteRegistration,"Registration deleted Successfully");
});

export {createRegistration,getAllRegistrations,getRegistrationsByEventId,updateRegistration,deleteRegistration}