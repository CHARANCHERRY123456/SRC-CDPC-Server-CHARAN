import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const alumniSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  batch: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar:{
    type:String,
    trim:true,
  },
  refreshToken: {
    type: String,
  },
    companyName: {
      type: String,
      trim: true,
      // required: [true, "Company name is required"],
    },
    designation: {
      type: String,
      trim: true,
    },
    workingLocation: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
    },
    linkedin: {
      type: String,
      trim: true,
      // match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, "Invalid LinkedIn URL"],
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
  careerGoals: {
    type: String,
    trim: true,
  },
  achievements: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  userType: {
    type: String, // User type as a simple string
    default: "alumni", // Set default to "student"
    trim: true,
  },
  
},{timestamps:true}
);


alumniSchema.pre("save",async function (next){
    if(!this.isModified("password"))
        return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
})

alumniSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password);
}

alumniSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
          _id: this._id,
          email: this.email,
          userType:this.userType,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
}

alumniSchema.methods.generateRefreshToken=function(){
  return jwt.sign(
      {
        _id: this._id,
        userType:this.userType,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
}


const Alumni = mongoose.model('Alumni', alumniSchema);
export default Alumni;
