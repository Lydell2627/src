import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'nitelmw', 
  api_key: '118391425587624', 
  api_secret: 'cky5T6-FMqOCy1UPsftF6uim2cc' 
});
import fs from 'fs';

const uploadOnCLoudinary=async (localFilePath)=>{
    try {
        if (!localFilePath) 
            return null
            console.log("the file is not present")
            const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("file is uploaded sucessfully",response.url);
            fs.unlinkSync(localFilePath)
            return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}



// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });
  export {uploadOnCLoudinary}
  