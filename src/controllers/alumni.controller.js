import { asyncHandler } from "../utils/asyncHandler.js";
import Alumni from "../models/alumni.model.js";
import { uploadOnCloudinary,deleteFromClodinary } from "../utils/cloudinary.js"; // Optional for handling file uploads
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";



const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const alumni= await Alumni.findById(userId)
        // console.log(student);
        const accessToken=alumni.generateAccessToken()
        
        const refreshToken=alumni.generateRefreshToken()

        await alumni.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch(err){
        console.log(err);
        throw new ApiError(500,"Something went wrong while generating tokens");
    }
}


/**
 * @desc Register a new alumni
 * @route POST /api/alumni/register
 * @access Public
 */

// const transformNestedFields = (body) => {
//   const result = {};
//   for (const [key, value] of Object.entries(body)) {
//     const keys = key.split('.');
//     keys.reduce((acc, curr, index) => {
//       if (index === keys.length - 1) {
//         acc[curr] = value;
//       } else {
//         acc[curr] = acc[curr] || {};
//       }
//       return acc[curr];
//     }, result);
//   }
//   return result;
// };


export const registerAlumni = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    batch,
    branch,
    phone,
    companyName,
    designation,
    workingLocation,
    experience,
    github,
    linkedin,
    portfolio,
    facebook,
    careerGoals,
    achievements,
    skills,
    userType,
  } = req.body;
console.log(req.body);
  if (!name || !email || !password || !batch || !branch) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  const existingAlumni = await Alumni.findOne({ email });
  if (existingAlumni) {
    throw new ApiError(409, "Alumni with this email already exists.");
  }

  let avatarUrl = null;
  if (req.file) {
    try {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      avatarUrl = uploadedImage.secure_url;
    } catch (error) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
    }
  }
  // const transformedBody = transformNestedFields(req.body);

  const alumni = await Alumni.create({
    name,
    email,
    password,
    batch,
    branch,
    phone,
    companyName,
    designation,
    workingLocation,
    experience,
    github,
    linkedin,
    portfolio,
    facebook,
    careerGoals,
    achievements,
    skills,
    avatar:avatarUrl,
    userType,

  });
  
  console.log("Saved Alumni:", alumni);
  
//   const alumni = await Alumni.create({
//     name,
//     email,
//     password,
//     batch,
//     branch,
//     phone,
//     companyDetails, // Accept the nested object directly
//     socialLinks, // Accept the nested object directly
//     careerGoals,
//     achievements,
//     skills,
//     avatar: avatarUrl,
//   });
//  console.log(alumni);
  const createdAlumni = await Alumni.findById(alumni._id).select(
    "-password -refreshToken"
  );

  if (!createdAlumni) {
    throw new ApiError(500, "Something went wrong.");
  }

  res.status(201).json(
    new ApiResponse(201, "Alumni registered successfully", createdAlumni)
  );
});


/**
 * @desc Login alumni
 * @route POST /api/alumni/login
 * @access Public
 */
export const loginAlumni = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new ApiError(400,"email and password are missing")
    }

    const alumni = await Alumni.findOne({email});

    if(!alumni){
        throw new ApiError(404,"Alumni does not Exist");
    }

    const isPasswordCorrect= await alumni.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid credentials");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(alumni._id);

    const loggedInAlumni= await Alumni.findById(alumni._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true, // Set to false for local development
      sameSite: 'None', 
  };
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                alumni:loggedInAlumni,
                accessToken,refreshToken
            },
            "Alumni logged in successfully"
        )
    )
})

export const logoutAlumni = asyncHandler(async(req,res)=>{
  await Alumni.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new :true
    }
  )


  const options = {
    httpOnly: true,
    secure: true, // Set to false for local development
    sameSite: 'None', 
};


  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"Alumni logged out Successfully "))
})


export const getCurrentAlumni = asyncHandler(async(req,res)=>{
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Alumni fetched Successfully"
    )
  )
})

export const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {name,
    email,
    batch,
    branch,
    phone,
    companyName,
    designation,
    workingLocation,
    experience,
    github,
    linkedin,
    portfolio,
    facebook,
    careerGoals,
    achievements,
    skills,
    } = req.body;

    if (!name || !email || !batch || !branch) {
      throw new ApiError(400, "All required fields must be filled.");
    }
  const alumni = await Alumni.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        name,
    email,
    batch,
    branch,
    phone,
    companyName,
    designation,
    workingLocation,
    experience,
    github,
    linkedin,
    portfolio,
    facebook,
    careerGoals,
    achievements,
    skills
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,alumni,"Alumni details updated Successfully"))
});

export const updateAvatar = asyncHandler(async (req,res)=>{
  const avatarLocalPath=req.file.path
  const alumni = await Alumni.findById(req.user._id)
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is missing");
  }
  // console.log(avatarLocalPath);

  if(alumni.avatar){
    const publicId = alumni.avatar.split("/").pop().split(".")[0];
    await(deleteFromClodinary(publicId));
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if(!avatar){
      throw new ApiError(400,"Error while uploading new avatar");
  }

  const updatedAlumni = await Alumni.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        avatar:avatar?.secure_url
      }
    },{
      new :true
    }
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,updatedAlumni,"Avatar image updated Successfully")
  )
})

/**
 * @desc Update alumni details
 * @route PUT /api/alumni/:id
 * @access Private
 */
// export const updateAlumni = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   const alumni = await Alumni.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
//   if (!alumni) {
//     throw new ApiError(404, "Alumni not found.");
//   }

//   res.status(200).json(
//     new ApiResponse(200, "Alumni updated successfully", alumni)
//   );
// });

/**
 * @desc Get alumni details
 * @route GET /api/alumni/:id
 * @access Public
 */
// export const getAlumni = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const alumni = await Alumni.findById(id);
//   if (!alumni) {
//     throw new ApiError(404, "Alumni not found.");
//   }

//   res.status(200).json(
//     new ApiResponse(200, "Alumni retrieved successfully", alumni)
//   );
// });

/**
 * @desc Delete alumni
 * @route DELETE /api/alumni/:id
 * @access Private
 */
// export const deleteAlumni = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const alumni = await Alumni.findByIdAndDelete(id);
//   if (!alumni) {
//     throw new ApiError(404, "Alumni not found.");
//   }

//   res.status(200).json(
//     new ApiResponse(200, "Alumni deleted successfully")
//   );
// });

/**
 * @desc Get all alumni
 * @route GET /api/alumni
 * @access Public
 */
// export const getAllAlumni = asyncHandler(async (req, res) => {
//   const alumniList = await Alumni.find();

//   res.status(200).json(
//     new ApiResponse(200, "Alumni list retrieved successfully", alumniList)
//   );
// });


// export {registerAlumni};