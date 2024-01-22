import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import fs from 'fs';
import { response } from "express";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.API_SECRET 
});
const uploadOnCLoudinary=async (localFilePath)=>{
    try {
        if (!localFilePath) 
            return null
            console.log("the file is not present")
            cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("file is uploaded sucessfully",response.url);
            return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}



cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });