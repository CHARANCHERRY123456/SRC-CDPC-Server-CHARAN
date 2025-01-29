import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Job from "../models/jobs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {Company} from "../models/company.model.js"
// Add a new job post
const addJobPost = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    locationType,
    salaryRange,
    requiredSkills,
    jobDescription,
    eligibilityCriteria,
    batch,
    branches,
    deadline,
    recruitmentProcess,
    jobType,
    contactEmail,
  } = req.body;
  // console.log(req.body);
  if (
    !title ||
    !company ||
    !location ||
    !locationType ||
    !salaryRange ||
    !jobDescription ||
    !deadline ||
    !jobType ||
    !contactEmail
  ) {
    throw new ApiError(400, "All necessary details are required.");
  }

  if (new Date(deadline) < new Date()) {
    throw new ApiError(400, "Invalid or past deadline.");
  }

  const newJob = await Job.create({
    title,
    company,
    location,
    locationType,
    salaryRange,
    requiredSkills,
    jobDescription,
    eligibilityCriteria,
    batch,
    branches,
    deadline,
    recruitmentProcess,
    jobType,
    contactEmail,
  });

  const createdJob = await Job.findById(newJob._id).populate("company");
  if (!createdJob) {
    throw new ApiError(500, "Failed to create job post.");
  }

  return res.status(201).json(
    new ApiResponse(201, createdJob,"Job posted successfully")
  );
});

// Fetch all job posts with filters
const getJobPosts = asyncHandler(async (req, res) => {
  const { older, closed, jobType } = req.query; // Add jobType to query params

  let filter = {};

  // Filter for older jobs (jobs posted before today)
  if (older) {
    filter.postingDate = { $lt: new Date() };
  } 
  // Filter for closed jobs (jobs where the deadline is past)
  else if (closed) {
    filter.deadline = { $lt: new Date() };
  } 
  // Default filter for open jobs (jobs with a future deadline)
  else {
    filter.deadline = { $gte: new Date() };
  }

  // Filter for jobType if provided
  if (jobType) {
    filter.jobType = jobType; // Filter based on job type (Full-time or Internship)
  }

  // Fetch jobs based on the filter criteria
  const jobs = await Job.find(filter)
    .sort({ postingDate: -1 })  // Sort by postingDate in descending order
    .populate("company");       // Populate the company details

  return res.status(200).json(
    new ApiResponse(200, jobs,"Jobs fetched successfully")
  );
});


// Fetch a single job by ID
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id).populate("company");

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  return res.status(200).json(
    new ApiResponse(200, job, "Job fetched successfully")
  );
});

// Update a job post
const updateJobPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const updateData = req.body;
  const cleanedCompanyId = id.trim().replace(/['"]/g, '');
  if (updateData.deadline && new Date(updateData.deadline) < new Date()) {
    throw new ApiError(400, "Invalid or past deadline.");
  }

  const updatedJob = await Job.findByIdAndUpdate(cleanedCompanyId, updateData, {
    new: true,
  }).populate("company");

  if (!updatedJob) {
    throw new ApiError(404, "Job not found or update failed.");
  }

  return res.status(200).json(
    new ApiResponse(200,  updatedJob,"Job updated successfully")
  );
});

// Delete a job post
const deleteJobPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedJob = await Job.findByIdAndDelete(id);

  if (!deletedJob) {
    throw new ApiError(404, "Job not found or already deleted.");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedJob,"Job deleted successfully")
  );
});

// Fetch jobs by company ID
const getJobsByCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
     // Convert to ObjectId
    //  console.log(id);
     const companyObjectId = new mongoose.Types.ObjectId(id);
    //  console.log("Company ObjectId:", companyObjectId);
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyObjectId)) {
      throw new ApiError(400, "Invalid Company ID format.");
    }
    
   

    // Check if Company Exists
    const companyExists = await Company.findById(companyObjectId);
    if (!companyExists) {
      throw new ApiError(404, "Company not found.");
    }

    // Find Jobs
    const jobs = await Job.find({ company: companyObjectId })
      .sort({ postingDate: -1 })
      .populate("company");
    
    // console.log("Jobs found:", jobs);

    if (!jobs || jobs.length === 0) {
      throw new ApiError(404, "No jobs found for the specified company.");
    }

    return res.status(200).json(new ApiResponse(200, "Jobs fetched successfully", jobs));

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
});

// Deactivate a job post
const deactivateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deactivatedJob = await Job.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!deactivatedJob) {
    throw new ApiError(404, "Job not found or already deactivated.");
  }

  return res.status(200).json(
    new ApiResponse(200, deactivatedJob,"Job deactivated successfully")
  );
});

// Reactivate a job post
const reactivateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reactivatedJob = await Job.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );

  if (!reactivatedJob) {
    throw new ApiError(404, "Job not found or already active.");
  }

  return res.status(200).json(
    new ApiResponse(200,  reactivatedJob,"Job reactivated successfully")
  );
});

export {
  addJobPost,
  getJobPosts,
  getJobById,
  updateJobPost,
  deleteJobPost,
  getJobsByCompany,
  deactivateJob,
  reactivateJob,
};
