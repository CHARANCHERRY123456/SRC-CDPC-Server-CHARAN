import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Job from "../models/jobs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addJobPost =asyncHandler(async(req,res)=>{
    const {title, company, description, location, salaryRange, deadline } = req.body;
    if(!title || !company || !description || !location || !salaryRange || !deadline){
        throw new ApiError(400,"All neccessary details are required. ");
    }
    if (!deadline || new Date(deadline) < new Date()) {
        // return res.status(400).send('Invalid or past deadline.');
        throw new ApiError(400,"Invalid or past deadline.");
    }

    const newJob = await Job.create({
        title,
        company,
        description,
        location,
        salaryRange,
        deadline,
      });
      const createdJob= await Job.findById(newJob._id);
      if(!createdJob){
        throw new ApiError(500,"something went wrong");
      }
      return res.status(201).json(
        new ApiResponse(201,"Job posted Successfully",createdJob)
      )

})

const getJobPosts = asyncHandler(async(req,res)=>{
    const { older, closed } = req.query;

    let filter = {};

    if (older) {
      filter = { postingDate: { $lt: new Date() } }; // Older postings
    } else if (closed) {
      filter = { deadline: { $lt: new Date() } }; // Closed jobs
    } else {
      filter = { deadline: { $gte: new Date() } }; // Open jobs
    }
    const jobs = await Job.find(filter).sort({ postingDate: -1 });
    return res.status(200).json(
        new ApiResponse(200,"jobs fetched Successfully",jobs)
    )

})

export {addJobPost,getJobPosts};