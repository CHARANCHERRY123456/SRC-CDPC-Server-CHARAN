import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary,deleteFromClodinary } from "../utils/cloudinary.js";
const createCompany = asyncHandler(async (req, res) => {
    const {
      name,
      industry,
      locations,
      website,
      headquarters,
      contactDetails,
      hiringPattern,
      placementStats,
      alumniProfiles,
      interviewExperiences,
    } = req.body;
    console.log(req.body)
    // Validation errors collection
    const errors = [];
  
    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        console.log(name)
      errors.push("Company name is required and must be a non-empty string.");
    }
  
    // Validate website
    if (website && !/^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+[/#?]?.*$/.test(website)) {
      errors.push("Invalid website URL.");
    }
  
    // Validate contactDetails
    if (contactDetails) {
      if (contactDetails.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contactDetails.email)) {
        errors.push("Invalid email address.");
      }
      if (
        contactDetails.phone &&
        !/^[0-9]{10,15}$/.test(contactDetails.phone)
      ) {
        errors.push(
          "Phone number must be a numeric string with 10 to 15 digits."
        );
      }
    }
  
    // Validate placementStats
    if (placementStats) {
      if (
        placementStats.totalHired !== undefined &&
        (typeof placementStats.totalHired !== "number" || placementStats.totalHired < 0)
      ) {
        errors.push("Total hired must be a non-negative number.");
      }
      if (
        placementStats.avgSalary !== undefined &&
        (typeof placementStats.avgSalary !== "number" || placementStats.avgSalary < 0)
      ) {
        errors.push("Average salary must be a positive number.");
      }
      if (
        placementStats.highestSalary !== undefined &&
        (typeof placementStats.highestSalary !== "number" || placementStats.highestSalary < 0)
      ) {
        errors.push("Highest salary must be a positive number.");
      }
      if (
        placementStats.lowestSalary !== undefined &&
        (typeof placementStats.lowestSalary !== "number" || placementStats.lowestSalary < 0)
      ) {
        errors.push("Lowest salary must be a positive number.");
      }
    }
  
    // Validate alumniProfiles
    if (alumniProfiles && Array.isArray(alumniProfiles)) {
      alumniProfiles.forEach((profile, index) => {
        if (profile.name && typeof profile.name !== "string") {
          errors.push(`Alumni profile #${index + 1}: Name must be a string.`);
        }
        if (
          profile.linkedin &&
          !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(profile.linkedin)
        ) {
          errors.push(`Alumni profile #${index + 1}: Invalid LinkedIn URL.`);
        }
        if (
          profile.batchYear &&
          (typeof profile.batchYear !== "number" ||
            profile.batchYear < 1900 ||
            profile.batchYear > new Date().getFullYear())
        ) {
          errors.push(`Alumni profile #${index + 1}: Invalid batch year.`);
        }
      });
    }
  
    // Validate interviewExperiences
    if (interviewExperiences && Array.isArray(interviewExperiences)) {
      interviewExperiences.forEach((experience, index) => {
        if (experience.person && typeof experience.person !== "string") {
          errors.push(
            `Interview experience #${index + 1}: Person name must be a string.`
          );
        }
        if (
          experience.linkedin &&
          !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(experience.linkedin)
        ) {
          errors.push(
            `Interview experience #${index + 1}: Invalid LinkedIn URL.`
          );
        }
        if (experience.rounds && Array.isArray(experience.rounds)) {
          experience.rounds.forEach((round, roundIndex) => {
            if (round.roundNumber && typeof round.roundNumber !== "number") {
              errors.push(
                `Interview experience #${index + 1}, round #${roundIndex + 1}: Round number must be a number.`
              );
            }
            if (
              round.difficulty &&
              !["Easy", "Medium", "Hard"].includes(round.difficulty)
            ) {
              errors.push(
                `Interview experience #${index + 1}, round #${roundIndex + 1}: Difficulty must be 'Easy', 'Medium', or 'Hard'.`
              );
            }
          });
        }
      });
    }
  
    // If there are validation errors, return them
    if (errors.length > 0) {
        console.log(errors);
      throw new ApiError(400, "Validation Error", errors);
    }
  
    // Check for duplicate company
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      throw new ApiError(400, `Company with name "${name}" already exists.`);
    }

    let logoUrl = null;
    if (req.file) {
        try {
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        logoUrl = uploadedImage.secure_url;
        } catch (error) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
        }
    }
  
    // Create a new company
    const newCompany = await Company.create({
      name,
      industry,
      locations,
      website,
      headquarters,
      contactDetails,
      hiringPattern,
      placementStats,
      alumniProfiles,
      interviewExperiences,
      logo:logoUrl
    });
    res.status(201).json(
      new ApiResponse(201, "Company created successfully", newCompany)
    );
  });
// Get all companies
const getAllCompanies = asyncHandler(async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(
        new ApiResponse(200,"All companies fetched successfully",companies)
      );
    } catch (error) {
        throw new ApiError(500,"Error fetching companies")
    }
  });
  // Get a single company by ID
const getCompanyById = asyncHandler(async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        throw new ApiError(404,"company not found");
      }
      res.status(200).json(new ApiResponse(200,"Company fetched successfully",company));
    } catch (error) {
      throw new ApiError(500,"Error fetching company");
    }
  })
  
const updateCompany = asyncHandler(async (req, res) => {
    try {
      const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!company) {
        throw new ApiError(404, 'Company not found');
      }
      res.status(200).json(new ApiResponse(200, 'Company updated successfully', company));
    } catch (error) {
      throw new ApiError(500, 'Error updating company');
    }
  });
const updateLogo = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract company ID from the route parameter
    const logoLocalPath = req.file?.path; // Ensure the file is uploaded
  
    if (!logoLocalPath) {
      throw new ApiError(400, "Logo file is missing");
    }
  
    const company = await Company.findById(id); // Fetch the company
    if (!company) {
      throw new ApiError(404, "Company not found");
    }
  
    // Remove the old logo from Cloudinary if it exists
    if (company.logo) {
      const publicId = company.logo.split("/").pop().split(".")[0];
      await deleteFromClodinary(publicId);
    }
  
    // Upload the new logo
    const logo = await uploadOnCloudinary(logoLocalPath);
    if (!logo) {
      throw new ApiError(400, "Error while uploading the new logo");
    }
  
    // Update the company document
    company.logo = logo.secure_url;
    await company.save();
  
    return res.status(200).json(
      new ApiResponse(200, "Logo updated successfully", company)
    );
  });

const deleteCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Attempt to find and delete the company
    const company = await Company.findByIdAndDelete(id);
  
    if (!company) {
      throw new ApiError(404, 'Company not found'); // Throw error if company doesn't exist
    }
  
    // Return success response
    return res.status(200).json(
      new ApiResponse(200, 'Company deleted successfully',company)
    );
  });
  
// Manual validation for alumni profile
const validateAlumniProfile = (data) => {
    console.log(data);
    if (!data.name || typeof data.name !== 'string') {
      throw new ApiError(400, 'Name is required and must be a string.');
    }
    if (!data.position || typeof data.position !== 'string') {
      throw new ApiError(400, 'Position is required and must be a string.');
    }
    if (data.linkedin && typeof data.linkedin !== 'string') {
      throw new ApiError(400, 'LinkedIn must be a valid string URL.');
    }
    if (
      !data.batchYear ||
      typeof data.batchYear !== 'number' ||
      data.batchYear < 1900 ||
      data.batchYear > new Date().getFullYear()
    ) {
      throw new ApiError(400, 'Batch year must be a valid year.');
    }
  };
  
  // Manual validation for interview experience
  const validateInterviewExperience = (data) => {
    if (!data.person || typeof data.person !== 'string') {
      throw new ApiError(400, 'Person is required and must be a string.');
    }
    if (!data.comment || typeof data.comment !== 'string') {
      throw new ApiError(400, 'Comment is required and must be a string.');
    }
    if (data.linkedin && typeof data.linkedin !== 'string') {
      throw new ApiError(400, 'LinkedIn must be a valid string URL.');
    }
    if (!data.date || isNaN(Date.parse(data.date))) {
      throw new ApiError(400, 'Date must be a valid date.');
    }
    if (!data.rounds || !Array.isArray(data.rounds)) {
      throw new ApiError(400, 'Rounds must be an array of round details.');
    }
  
    // Validate each round
    data.rounds.forEach((round, index) => {
      if (
        !round.roundNumber ||
        typeof round.roundNumber !== 'number' ||
        round.roundNumber <= 0
      ) {
        throw new ApiError(
          400,
          `Round ${index + 1}: Round number must be a positive number.`
        );
      }
      if (!round.description || typeof round.description !== 'string') {
        throw new ApiError(
          400,
          `Round ${index + 1}: Description is required and must be a string.`
        );
      }
      if (
        !['Easy', 'Medium', 'Hard'].includes(round.difficulty)
      ) {
        throw new ApiError(
          400,
          `Round ${index + 1}: Difficulty must be one of 'Easy', 'Medium', 'Hard'.`
        );
      }
    });
  };
  
  // Add an alumni profile to a company
const addAlumniProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Validate request body
    validateAlumniProfile(req.body);
    console.log(id);
    const company = await Company.findById(id);
    if (!company) {
      throw new ApiError(404, 'Company not found.');
    }
  
    // Push the validated data
    company.alumniProfiles.push(req.body);
    await company.save();
  
    res
      .status(200)
      .json(
        new ApiResponse(200, 'Alumni profile added successfully.', company)
      );
  });
  
  // Add an interview experience to a company
const addInterviewExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Validate request body
    validateInterviewExperience(req.body);
  
    const company = await Company.findById(id);
    if (!company) {
      throw new ApiError(404, 'Company not found.');
    }
  
    // Push the validated data
    company.interviewExperiences.push(req.body);
    await company.save();
  
    res
      .status(200)
      .json(
        new ApiResponse(200, 'Interview experience added successfully.', company)
      );
  });
  
  export  {createCompany,getAllCompanies,getCompanyById,updateCompany,updateLogo,deleteCompany,addAlumniProfile,addInterviewExperience};