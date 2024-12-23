import {v2 as cloudinary } from "cloudinary"
import fs from "fs";
import { ApiError } from "./ApiError.js";
import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath){
            console.log("No file path provided.");
            return null;
        }
        
        console.log("Uploading file to Cloudinary");

        console.log(localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        });
        // console.log(response);
        fs.unlinkSync(localFilePath);

        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
};



const deleteFromClodinary = async (publicId)=>{
    try{
        if(!publicId){
            throw new ApiError("public id required for deletion")
        }
        const response=await cloudinary.uploader.destroy(publicId);
        return response;
    }catch(error){
        throw new ApiError(400,"Error whiile deleteing file")
    }
}

export {uploadOnCloudinary}