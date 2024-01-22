import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
const lim="20kb";
const app=express()
app.use(cors({
    origin:process.env.CORSE_ORIGIN,
    credentials:true
    })) 
app.use(express.json({limit:lim}))
app.use(express.urlencoded({extended:true,limit:lim}))
app.use(express.static("public"))
app.use(cookieparser())
//routes
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)












export {app};

