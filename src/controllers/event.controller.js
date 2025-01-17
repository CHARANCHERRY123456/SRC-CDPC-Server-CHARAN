import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary,deleteFromClodinary } from "../utils/cloudinary.js";
import { EventRegistration } from "../models/eventRegistration.model.js";
import Event from "../models/event.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createEvent = asyncHandler(async (req,res)=>{
    const { title, date, venue, details, capacity } = req.body;
    if(!title || !date || !venue){
        throw new ApiError(400,"Events details are required");
    }
    let imageUrl = null;
    if (req.file) {
      try {
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        imageUrl = uploadedImage.secure_url;
      } catch (error) {
        throw new ApiError(500, "Failed to upload eventImage to Cloudinary.");
      }
    }

    const event = await Event.create({
        title,
        date,
        venue,
        details,
        capacity,
        image:imageUrl
    })
    console.log("created Event :",event);

    if(!event){
        throw new ApiError(500,"Something went wrong , failed to create new Event.");
    }

    return res.status(201).json(
        new ApiResponse(201,event,"Event created Successfully...")
    );

})

const getAllEvents = asyncHandler(async (req,res)=>{
    const events= await Event.find();
    if(!events){
        throw new ApiError(500,"Failed to fetch events");
    }
    // console.log(events);
    return res.status(200).json(
        new ApiResponse(200,events,"Events fteched Successfully..")
    );
})

const getEventById = asyncHandler(async(req,res)=>{
    const event = await Event.findById(req.params.id);
    if(!event){
        throw new ApiError(404,"Event not found");
    }

    return res.status(200).json(
        new ApiResponse(200,event,"Event fetched Successfully")
    );


})

const updateEvent = asyncHandler(async (req, res) => {
    const { title, date, venue, details, capacity } = req.body;
    // Validate required fields
    if (!title || !date || !venue) {
      throw new ApiError(400, "Title, date, and venue are required to update an event.");
    }
  
    // Get the event ID from request params
    const eventId = req.params.id;
    if (!eventId) {
      throw new ApiError(400, "Event ID is required.");
    }
  
    // Fetch the event to update
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, "Event not found.");
    }
  
    // Handle Cloudinary image update if a new file is provided
    let updatedImageUrl = event.image; // Default to the existing image
    if (req.file) {
      try {
        // Delete the previous image from Cloudinary, if any
        if (event.image) {
          const publicId = event.image.split("/").pop().split(".")[0];
          await deleteFromClodinary(publicId);
        }
  
        // Upload the new image to Cloudinary
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        updatedImageUrl = uploadedImage.secure_url;
      } catch (error) {
        throw new ApiError(500, "Failed to update event image on Cloudinary.");
      }
    }
  
    // Update the event fields
    event.title = title;
    event.date = date;
    event.venue = venue;
    event.details = details || event.details; // Update if provided
    event.capacity = capacity || event.capacity; // Update if provided
    event.image = updatedImageUrl; // Update with the new or existing image
  
    // Save the updated event
    await event.save();
  
    // Respond with the updated event details
    res.status(200).json(
      new ApiResponse(200, event, "Event updated successfully.")
    );
  });

const deleteEvent = asyncHandler(async(req,res)=>{
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
          throw new ApiError(400,"Event not found");
    }
    return res.status(200).json(new ApiResponse(200,deletedEvent,"Event deleted Successfully"));
});

  


// Update feedback for an event registration
const updateFeedback = asyncHandler(async (req, res) => {
  const { fullName, email, phone, feedback, eventId } = req.body; // Extract all required fields

  // Validate input
  if (!feedback || !fullName || !email || !phone || !eventId) {
    throw new ApiError(400, "All fields are required (fullName, email, phone, eventId, and feedback).");
  }

// Find the registration where at least one field matches
const registration = await EventRegistration.findOne({
    eventId, // Mandatory to match the specific event
    $or: [
      { fullName },
      { email },
      { phone },
    ],
  });
  
  if (!registration) {
    throw new ApiError(404, "No registration found with the provided details.");
  }
  

  // Update the feedback field
  registration.feedback = feedback;
  await registration.save();

  return res.status(200).json(new ApiResponse(200, registration, "Feedback updated successfully."));
});


export {createEvent,getAllEvents,getEventById,updateEvent,deleteEvent,updateFeedback};