import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from './routes/studentRouter.js'
import alumniRouter from "./routes/alumniRouter.js"
const app=express()


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/student",studentRouter)
app.use("/api/alumni",alumniRouter)

export {app}