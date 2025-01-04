import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Internhip from "../models/internship.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addInternshipPost =asyncHandler(async(req,res)=>{
    const {title, company, description, location, stipend, deadline } = req.body;
    if(!title || !company || !description || !location || !stipend || !deadline){
        throw new ApiError(400,"All neccessary details are required. ");
    }
    if (!deadline || new Date(deadline) < new Date()) {
        // return res.status(400).send('Invalid or past deadline.');
        throw new ApiError(400,"Invalid or past deadline.");
    }

    const newInternship = await Internhip.create({
        title,
        company,
        description,
        location,
        stipend,
        deadline,
      });
      const createdInternship= await Internhip.findById(newInternship._id);
      if(!createdInternship){
        throw new ApiError(500,"something went wrong");
      }
      return res.status(201).json(
        new ApiResponse(201,"Internship posted Successfully",createdInternship)
      )

})

const getInternshipPosts = asyncHandler(async(req,res)=>{
    const { older, closed } = req.query;

    let filter = {};

    if (older) {
      filter = { postingDate: { $lt: new Date() } }; // Older postings
    } else if (closed) {
      filter = { deadline: { $lt: new Date() } }; // Closed jobs
    } else {
      filter = { deadline: { $gte: new Date() } }; // Open jobs
    }
    const internships = await Internhip.find(filter).sort({ postingDate: -1 });
    return res.status(200).json(
        new ApiResponse(200,"Internships fetched Successfully",internships)
    )

})

export {addInternshipPost,getInternshipPosts};