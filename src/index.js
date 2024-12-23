import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/connect.js"


dotenv.config(
    {
        path:"./.env"
    }
)


// console.log("Environment variables :",process.env)


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MonggiDB connection failed ! ! ! ",err);
})