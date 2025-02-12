import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import xlsx from "xlsx";
import { Applicant } from "../models/applicant.model.js";
import { Company } from "../models/company.model.js";
import { Placement } from "../models/placement.model.js";
import { Application } from "../models/application.model.js";
/**
 * @desc Upload placement data from Excel file
 * @route POST /api/placements/upload
 * @access Admin
 */
export const uploadPlacements = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded.");
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet); // Convert Excel to JSON

    let uploadedCount = 0;
    let errors = [];
    const applications = await Application.find()
            .populate("applicantId")
            .populate({
                path: "jobId",
                populate: { path: "company", model: "Company" },
            });
        // console.log(applications);
    for (const row of data) {
        const { ApplicationId,Year, StudentEmail, PlacementStatus, CompanyName, JobRole, PackageOffered } = row;
        // console.log(ApplicationId);y
        // 1️⃣ Check if Student exists
        const student = await Applicant.findOne({ email: StudentEmail });
        if (!student) {
            errors.push({ rowData: row, reason: `Student not found (Email: ${StudentEmail})` });
            continue;
        }

        // 2️⃣ Check if Company exists
        const company = await Company.findOne({ name: CompanyName });
        if (!company) {
            errors.push({ rowData: row, reason: `Company not found (Company Name: ${CompanyName})` });
            continue;
        }
         // 3️⃣ Check if Application exists
         const application = await Application.findById(ApplicationId);
         if (!application) {
             errors.push({ rowData: row, reason: `Application not found (ID: ${ApplicationId})` });
             continue;
         }

        // 3️⃣ Save Placement Data
        const placement = await Placement.create({
            placementYear: Year,
            student: student._id,
            status: PlacementStatus,
            company: company._id,
            jobRole: JobRole,
            packageOffered: PackageOffered
        });
        

        application.applicationStatus = PlacementStatus;  // Set new status
        application.lastUpdated = Date.now();
        await application.save();

        uploadedCount++;
        
        // Update placement stats for the company
        const companyData = await Company.findById(company._id);

        if (companyData) {
            const totalHired = companyData.placementStats.totalHired + 1;
            const newAvgSalary =
                (companyData.placementStats.avgSalary * companyData.placementStats.totalHired + PackageOffered) /
                totalHired;
            const newHighestSalary = Math.max(companyData.placementStats.highestSalary || 0, PackageOffered);
            const newLowestSalary =
                companyData.placementStats.lowestSalary !== undefined
                    ? Math.min(companyData.placementStats.lowestSalary, PackageOffered)
                    : PackageOffered;

            // Update the company's placementStats
            await Company.findByIdAndUpdate(company._id, {
                $set: {
                    "placementStats.totalHired": totalHired,
                    "placementStats.avgSalary": newAvgSalary,
                    "placementStats.highestSalary": newHighestSalary,
                    "placementStats.lowestSalary": newLowestSalary
                }
            });
        }
        
        
    }

    return res.status(201).json(
        new ApiResponse(201, {
            uploadedRecords: uploadedCount,
            failedRecords: errors.length,
            errors: errors
        }, "Placement data upload completed.")
    );
});


/**
 * @desc Get all placement data
 * @route GET /api/placements
 * @access Admin
 */
export const getPlacements = asyncHandler(async (req, res) => {
    const placements = await Placement.find()
        .populate("student")
        .populate("company")
        .sort({ placementYear: -1 }); // Sort by latest year first

    if (!placements.length) {
        throw new ApiError(404, "No placement data found.");
    }

    return res.status(200).json(
        new ApiResponse(200, placements, "Placements retrieved successfully.")
    );
});


/**
 * @desc Get all placements, filtered by company name if provided
 * @route GET /api/placements
 * @access Admin
 * */
export const getPlacementsByCompany = asyncHandler(async (req, res) => {
    const { companyName, year, status } = req.query;
    let filter = {}; // ✅ Declare filter once

    if (companyName) {
        const company = await Company.findOne({ name: companyName });
        if (!company) {
            throw new ApiError(404, `Company '${companyName}' not found.`);
        }
        filter.company = company._id; // ✅ Assign company ID to filter
    }

    if (year) filter.placementYear = year; // ✅ Add year filter if provided
    if (status) filter.status = status; // ✅ Add status filter if provided

    const placements = await Placement.find(filter)
        .populate("student")
        .populate("company")
        .sort({ placementYear: -1 });

    if (!placements.length) {
        throw new ApiError(404, "No placements found for the given criteria.");
    }

    return res.status(200).json(
        new ApiResponse(200, placements, "Placements retrieved successfully.")
    );
});


export const getPlacementsByYear = asyncHandler(async (req, res) => {
    const { year } = req.query;

    if (!year) {
        throw new ApiError(400, "Placement year is required.");
    }

    const placements = await Placement.find({ placementYear: year })
        .populate("student")
        .populate("company")
        .sort({ placementYear: -1 });

    if (!placements.length) {
        throw new ApiError(404, `No placements found for the year ${year}.`);
    }

    return res.status(200).json(
        new ApiResponse(200, placements, `Placements for the year ${year} retrieved successfully.`)
    );
});

