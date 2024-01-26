import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import {User} from "../models/user.models.js";
import {uploadOnCLoudinary} from '../utils/cloudinary.js';
import { Apiresponse } from "../utils/Apiresponse.js";
const registerUser = asynchandler(async (req, res) => {
  const { username, EmailId, password, phoneNumber } = req.body



  if ([username, EmailId, password, phoneNumber].some((field)=>
  field?.trim()==="")) {
    throw new Apierror('Bad Request', 'Please fill all fields',400)
    }
    const existeduser=await User.findOne({
      $or:[{username},{EmailId}]
    })
    if (existeduser) {
      throw new Apierror(409,"the username and email is already present");
      
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const PhotoLocalPath=req.files?.Photo[0]?.path;
    
    let PhotoLocalPath;
    if (req.files && Array.isArray(req.files.Photo) && req.files.Photo.length > 0) {
        PhotoLocalPath = req.files.Photo[0].path
    }
    
    if (!avatarLocalPath) {
      throw new Apierror(400,"avatar file is required")
    }
    const avatar=await uploadOnCLoudinary(avatarLocalPath)
    const Photo=await uploadOnCLoudinary(PhotoLocalPath)
    if (!avatar) {
      throw new Apierror(400,"avatar file is required")
    }
    console.log("Creating user with the following object:", {
      username: username.toLowerCase(),
      EmailId,
      password,
      phoneNumber,
      avatar: avatar.url,
      Photo: Photo?.url,
    });
    
    const user = await User.create({
      username: username.toLowerCase(),
      EmailId,
      password,
      phoneNumber,
      avatar: avatar.url,
      Photo: Photo?.url,
    });


    const createdUser=await User.findById(user._id).select(
      "-Password -refreshToken"
    )
    if (!createdUser) {
      throw new Apierror(404, "something went wrong, user not found");
    }
    return res.status(201).json(
      new Apiresponse(200,createdUser,"The user is sucessfully registered")
    )


  })


export { registerUser,
 };




















 /*get all user deetails from fronted
validation
check if user already exists or no
check if user files are present or no
 upload the images to cloudinary etc
 create user object -- create user entry etc
 remove password and refresh token field from response
 check for user creation
 return response*/