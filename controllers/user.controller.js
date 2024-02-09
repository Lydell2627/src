import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import {User} from "../models/user.models.js";
import {uploadOnCLoudinary} from '../utils/cloudinary.js';
import { Apiresponse } from "../utils/Apiresponse.js";
import {jwt} from 'jsonwebtoken';




const generateAccessAndRefreshToken=async(userId)=>{
try {
  const user=await User.findById(userId);
  const accessToken=user.generateAccessToken();
  console.log(accessToken)
  const refreshToken=user.generateRefreshToken();
  //console.log(refreshToken)

  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false});//to bypass the token validation in this case only
  return {accessToken,refreshToken}
} catch (error) {
  throw new Apierror(500,"Something went wrong while generating refresh, acess token")
  
}



}
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
  
  const loginUser=asynchandler(async(req,res)=>{
    const {username,EmailId,password}=req.body
    if (!(username||EmailId)) {
      throw new Apierror(400,"username or password is required")

    }
    const user=await User.findOne({
      $or:[{username},{EmailId}]
    })
        if(!user){
          throw new Apierror(401,'Invalid Credentials')
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new Apierror(401,'Password entered is wrong')}
      
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const  options={
      httpOnly:true,
      secure:true
    }    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new Apiresponse(200,loggedInUser,accessToken,refreshToken,"Logged in Succesfuly"))

  
  
  })
  const logoutUser=asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id ,{
      $set:{
        refreshToken:undefined
      }
      

    },{
      new:true,
    })
    const  options={
      httpOnly:true,
      secure:true
    }    
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new Apiresponse(200,{},"user logged out"))


  })
  const refreshAcessToken=asynchandler(async(req,res)=>{
    const incomingRefreshToken=req.cokkies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken){
      throw new Apierror(401,"No token provided ")
    }
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user= await User.findById(decodedToken?._id)
    if (!user) {
      throw new Apierror(401,'Invalid refresh token')
    }
    if (incomingRefreshToken!==user?.refreshToken) {

      throw new Apierror(401,' refresh token is expired or used')

    }
    




  })
  
  


export { registerUser,
  loginUser,logoutUser
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