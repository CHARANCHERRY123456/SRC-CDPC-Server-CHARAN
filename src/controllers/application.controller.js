import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";
import { Application } from "../models/application.model.js";
import { Applicant } from "../models/applicant.model.js";
// import { Company } from "../models/company.model.js";
// @desc    Create a new job application
// @route   POST /api/applications
// @access  Public
export const createApplication = asyncHandler(async (req, res) => {
  const { applicantId, jobId } = req.body;

  // Check if the application already exists for the given job
  const existingApplication = await Application.findOne({ applicantId, jobId });
  if (existingApplication) {
    return res.status(400).json(new ApiResponse(400, null, "Application already submitted for this job"));
  }

  const application = await Application.create({ applicantId, jobId });
  // Update the appliedJobs array of the applicant
await Applicant.findByIdAndUpdate(
  applicantId,
  { $addToSet: { appliedJobs: jobId } }, // Ensures jobId is added only if it doesn't already exist
  { new: true } // Returns the updated document
);

  return res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"));
});

// @desc    Get all job applications
// @route   GET /api/applications
// @access  Public
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
  .populate("applicantId")
  .populate({
    path: "jobId",  // Populate the jobId reference
    populate: {
      path: "company",  // Populate the company reference inside jobId
      model: "Company",  // The model name to use for the population
    },
  });
  return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Public
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
  .populate("applicantId")  // Populate the applicantId
  .populate({
    path: "jobId",  // Populate the jobId reference
    populate: {
      path: "company",  // Populate the company reference inside jobId
      model: "Company",  // The model name to use for the population
    },
  });

  if (!application) {
    return res.status(404).json(new ApiResponse(404, null, "Application not found"));
  }

  return res.status(200).json(new ApiResponse(200, application, "Application details fetched successfully"));
});

// @desc    Update application status
// @route   PATCH /api/applications/:id
// @access  Admin
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationStatus } = req.body;
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json(new ApiResponse(404, null, "Application not found"));
  }

  application.applicationStatus = applicationStatus;
  application.lastUpdated = Date.now();

  await application.save();
  return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
});

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Admin
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json(new ApiResponse(404, null, "Application not found"));
  }

  await application.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Application deleted successfully"));
});
