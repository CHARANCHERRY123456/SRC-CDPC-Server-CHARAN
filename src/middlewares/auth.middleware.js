import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import Alumni from "../models/alumni.model.js";
import Admin from "../models/admin.model.js";

// Enum-like object for user types
const userTypes = {
  ADMIN: "admin",
  STUDENT: "student",
  ALUMNI: "alumni",
};

// Middleware to verify JWT and authenticate users based on their type
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Retrieve the token from cookies or Authorization header
    // Log cookies to verify they are received
    // console.log("Received Cookies:", req.cookies);
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  // If no token is provided, throw an unauthorized error
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    // Verify the token using the secret key
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // If token verification fails, throw an invalid access token error
    throw new ApiError(401, "Invalid Access Token");
  }

  // Ensure the token contains required information
  if (!decodedToken || !decodedToken._id || !decodedToken.userType) {
    throw new ApiError(401, "Invalid Access Token");
  }

  let user;

  // Check the user type and retrieve the user from the corresponding model
  switch (decodedToken.userType) {
    
    case userTypes.STUDENT:
      user = await Student.findById(decodedToken._id).select("-password -refreshToken");
      break;
    case userTypes.ADMIN:
        user = await Admin.findById(decodedToken._id).select("-password -refreshToken");
        break;
    case userTypes.ALUMNI:
      user = await Alumni.findById(decodedToken._id).select("-password -refreshToken");
      break;
    
    default:
      // If the userType doesn't match any valid type, throw an error
      throw new ApiError(401, "Invalid User Type");
  }

  // If no user is found, throw an error
  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  // Attach the user to the request object for downstream handlers
  req.user = user;
  next();
});
