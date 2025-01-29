import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import { uploadOnCloudinary,deleteFromClodinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Alumni from "../models/alumni.model.js";


// fullName: "",
// email: "",
// phone: "",
// designation: "",
// avatar: "",
// username: "",
// password: "",
// confirmPassword: "",
// employeeId: "",
// adminAccessCode: "",


const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const admin = await Admin.findById(userId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
        await admin.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch(err){
        console.log(err);
        throw new ApiError(500,"Something went wrongg while generating tokens");
    }
}
const registerAdmin = asyncHandler(async (req,res)=>{
    const{
        name,
        email,
        phone,
        designation,
        username,
        password,
        confirmPassword,
        employeeId,
        adminAccessCode,
        userType,
    }=req.body;

    console.log(req.body);
    if(!name || !email || !username || !password || !confirmPassword || !employeeId || !adminAccessCode){
        throw new ApiError(400,"All required fields must be filled");
    }
    if (String(password) !== String(confirmPassword)) {
        throw new ApiError(400, "Password and confirmPassword must be the same.");
    }

    if (adminAccessCode !== process.env.ADMIN_ACCESS_CODE) {
        throw new ApiError(403, "Invalid Admin Access Code");
    }

    const existingAdmin = await Admin.findOne({
        $or:[{username},{email}]
    })

    if(existingAdmin){
        throw new ApiError(409,"Admin already exists");
    }

    let avatarUrl = null;
    if(req.file){
        try{
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            avatarUrl=uploadedImage.secure_url;
        }catch(error){
            throw new ApiError(500,"Failed to upload avatar to Cloudinary.");
        }
    }
    // console.log(avatarUrl);
    const admin = await Admin.create({
        name,
        email,
        phone,
        designation,
        username,
        password,
        employeeId,
        adminAccessCode,
        userType,
        avatar:avatarUrl,
    });

    console.log("saved Admin :",admin);


const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

if(!createdAdmin){
    throw new ApiError(500,"Something went wrong");
}

res.status(201).json(
    new ApiResponse(201,"Admin registered Successfully",createdAdmin)
);

});

const loginAdmin = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400,"Invalid credentials");
    }
    const admin = await Admin.findOne({email});

    if(!admin){
        throw new ApiError(404,"Admin does not exist");
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid credentials");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");
    // console.log(loggedInAdmin);
    const options = {
        httpOnly:true,
        secure:true,
        sameSite:"None",
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                admin:loggedInAdmin,
                accessToken,
                refreshToken
            },
            "Admin logged in Successfully"
        )
    )

})



const logoutAdmin = asyncHandler(async(req,res)=>{
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
    .json(new ApiResponse(200,{},"Admin logged out Successfully "))
  })



  const getCurrentAdmin = asyncHandler(async(req,res)=>{
    return res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "Admin fetched Successfully"
      )
    )
  })
  
  const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {        
        name,
        email,
        phone,
        designation,
        username,
        employeeId,
        } = req.body;
  
    if (!name || !email || !username || !employeeId) {
      throw new ApiError(400, "All required fields must be filled.");
    }
    const admin = await Admin.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
            name,
            email,
            phone,
            designation,
            username,
            employeeId,
        }
      },
      {new:true}
    ).select("-password")
  
    return res.status(200)
    .json(new ApiResponse(200,admin,"Admin details updated Successfully"))
  });
  
  const updateAvatar = asyncHandler(async (req,res)=>{
    const avatarLocalPath=req.file.path
    const admin = await Admin.findById(req.user._id)
    if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is missing");
    }
    // console.log(avatarLocalPath);
  
    if(admin.avatar){
      const publicId = admin.avatar.split("/").pop().split(".")[0];
      console.log(publicId);
      await(deleteFromClodinary(publicId));
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400,"Error while uploading new avatar");
    }
  
    const updatedAdmin = await Admin.findByIdAndUpdate(
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
      new ApiResponse(200,updatedAdmin,"Avatar image updated Successfully")
    )
  })


export {registerAdmin,loginAdmin,logoutAdmin,updateAccountDetails,updateAvatar,getCurrentAdmin,generateAccessAndRefreshToken};