import mongoose ,{Schema} from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const adminSchema = new Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
            lowercase:true,
            trim:true,
        },
        phone:{
            type:String,
            trim:true,
        },
        designation:{
            type:String,
            trim:true,
        },
        username:{
            type:String,
            required:[true,"username is required"],
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        employeeId:{
            type:String,
            required:[true,"employeeId required"],
        },
        AdminAccessCode:{
            type:String,
            reuired:[true,"admin access code required"],
        },
        refreshToken:{
            type:String
        },
        userType: {
            type: String, // User type as a simple string
            default: "admin", // Set default to "student"
            trim: true,
          },
          avatar:{
            type:String,
            trim:true,
          },

    },{timestamps:true}
)

adminSchema.pre("save",async function (next){
    if(!this.isModified("password"))      return next();
    this.password= await bcrypt.hash(this.password,10)
    next()
});

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userType:this.userType,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            userType:this.userType,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const Admin = mongoose.model("Admin",adminSchema);

export default Admin;