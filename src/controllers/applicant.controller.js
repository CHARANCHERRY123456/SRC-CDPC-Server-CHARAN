import { asyncHandler } from '../utils/asyncHandler.js';
import { Applicant } from '../models/applicant.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
// @desc    Create a new applicant
// @route   POST /api/applicants
// @access  Public
const createApplicant = asyncHandler(async (req, res) => {
  const { applicantId, name, email, phone, department, gender, dob, address, cgpa, resumeLink, skills, experience } = req.body;

  // Check if applicant already exists
  const existingApplicant = await Applicant.findOne({ email });
  if (existingApplicant) {
    throw new ApiError(400,'Applicant with this email already exists'); 
  }

  // Create new applicant
  const applicant = await Applicant.create({
    applicantId,
    name,
    email,
    phone,
    department,
    gender,
    dob,
    address,
    cgpa,
    resumeLink,
    skills,
  });

  return res.status(201).json(new ApiResponse(201, applicant, 'Applicant created successfully'));
});

// @desc    Get all applicants
// @route   GET /api/applicants
// @access  Public
const getAllApplicants = asyncHandler(async (req, res) => {
  const applicants = await Applicant.find().sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, applicants, 'Applicants fetched successfully'));
});

// @desc    Get a single applicant by ID
// @route   GET /api/applicants/:id
// @access  Public
const getApplicantById = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);

  if (!applicant) {
    throw new ApiError(404,"Applicant not found");
  }

  return res.status(200).json(new ApiResponse(200, applicant, 'Applicant details fetched successfully'));
});
const getApplicantByEmail = asyncHandler(async (req, res) => {
    const {email}=req.params;
    const applicant = await Applicant.findOne({email});
  
    if (!applicant) {
      throw new ApiError(404,"Applicant not found");
    }
  
    return res.status(200).json(new ApiResponse(200, applicant, 'Applicant details fetched successfully'));
  });

// @desc    Update applicant details
// @route   PUT /api/applicants/:id
// @access  Public
const updateApplicant = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);

  if (!applicant) {
    throw new ApiError(404,"Applicant not found");
  }

  // Update fields
  Object.assign(applicant, req.body);
  await applicant.save();

  return res.status(200).json(new ApiResponse(200, applicant, 'Applicant updated successfully'));
});

// @desc    Delete an applicant
// @route   DELETE /api/applicants/:id
// @access  Public
const deleteApplicant = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);

  if (!applicant) {
    throw new ApiError(404,"Applicant not found");
  }

  await applicant.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, 'Applicant deleted successfully'));
});

export { createApplicant, getAllApplicants, getApplicantById, updateApplicant, deleteApplicant,getApplicantByEmail };
