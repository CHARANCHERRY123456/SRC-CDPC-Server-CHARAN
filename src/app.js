import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from './routes/studentRouter.js'
import alumniRouter from "./routes/alumniRouter.js"
import adminRouter from "./routes/adminRouter.js"
import jobAndInternshipRouter from "./routes/jobAndInternshipRouter.js"
import authRouter from "./routes/authRouter.js"
import { ApiResponse } from './utils/ApiResponse.js'
import { verifyJWT } from './middlewares/auth.middleware.js'
import eventRouter from "./routes/eventRouter.js"
import companyRouter from "./routes/companyRouter.js"
import applicantRouter from "./routes/applicantRouter.js"
import applicationRouter from "./routes/applicationRouter.js"
import placementRouter from "./routes/placementRouter.js"
const app=express()

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend domain
    credentials: true, // Allow cookies
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/student",studentRouter)
app.use("/api/alumni",alumniRouter)
app.use("/api/admin",adminRouter)
app.use("/api",authRouter)
app.use("/api/event",eventRouter)
app.use("/api/jobs-internships",jobAndInternshipRouter)
app.use("/api/companies",companyRouter);
app.use("/api/applicants",applicantRouter);
app.use("/api/application",applicationRouter);
app.use("/api/placement",placementRouter);
// In your route handler
app.get("/api/verify-jwt", verifyJWT, (req, res) => {
        // console.log("verifcation of jwt");
    return res.status(200).json(
        new ApiResponse(200,{user: req.user}, "Token is valid",));
  });
  
// app.use((req, res, next) => {
//     console.log('Received Cookies:', req.cookies);
//     next();
// });
export {app}