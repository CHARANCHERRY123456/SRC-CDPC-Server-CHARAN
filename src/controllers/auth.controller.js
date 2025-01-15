import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import Admin from "../models/admin.model.js";
import Alumni from "../models/alumni.model.js";
import { generateAccessAndRefreshToken as generateStudentToken } from "../controllers/student.controller.js"; // Token generator for students
import { generateAccessAndRefreshToken as generateAdminToken } from "../controllers/admin.controller.js";   // Token generator for admins
import { generateAccessAndRefreshToken as generateAlumniToken } from "../controllers/alumni.controller.js"; // Token generator for alumni
import { ApiResponse } from "../utils/ApiResponse.js";

// Route to refresh the access token using the refresh token
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("No refresh token provided");
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user based on decoded data (user._id and user.userType)
    let user;
    switch (decoded.userType) {
      case 'student':
        user = await Student.findById(decoded._id);
        break;
      case 'admin':
        user = await Admin.findById(decoded._id);
        break;
      case 'alumni':
        user = await Alumni.findById(decoded._id);
        break;
      default:
        return res.status(401).send("Invalid user type");
    }

    if (!user) {
      return res.status(401).send("User not found");
    }
    // Generate a new access token based on the user type
    let accessToken;
    switch (decoded.userType) {
      case 'student':
        accessToken = generateStudentToken(user._id); // Generate token using student's specific logic
        break;
      case 'admin':
        accessToken = generateAdminToken(user._id); // Generate token using admin's specific logic
        break;
      case 'alumni':
        accessToken = generateAlumniToken(user._id); // Generate token using alumni's specific logic
        break;
      default:
        return res.status(401).send("Invalid user type");
    }
    console.log("accesstoken new :",accessToken);
    // Send the new access token to the client
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    return res.status(200).json(new ApiResponse(200,accessToken,"Access token refreshed"))
    // res.status(200).send({ message: "Access token refreshed" });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid or expired refresh token");
  }
};
