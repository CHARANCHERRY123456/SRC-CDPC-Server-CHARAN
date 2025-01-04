import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from './routes/studentRouter.js'
import alumniRouter from "./routes/alumniRouter.js"
import adminRouter from "./routes/adminRouter.js"
import jobAndInternshipRouter from "./routes/jobAndInternshipRouter.js"
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
app.use("/api/jobs-internships",jobAndInternshipRouter)
// app.use((req, res, next) => {
//     console.log('Received Cookies:', req.cookies);
//     next();
// });
export {app}