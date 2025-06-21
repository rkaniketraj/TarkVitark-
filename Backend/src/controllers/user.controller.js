import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Follow from "../models/follow.model.js";
import { DebateRoom } from "../models/debateRoom.model.js";

const generateAccessAndRefereshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        user.markModified("refreshToken"); 
         // add but havent save the user
         //when save is instiialised monfoose model get kickedmin then as model of user cintain password reqired abd we just giving it refresh token then throw an eroro
        await  user.save({validateBeforeSave: false})
       
        

        return {accessToken,refreshToken}




    }catch{
        throw new ApiError(500,"something wronge while generating ref and acc token")
    }

}


const registerUser = asyncHandler( async (req, res) => {
    

   const {fullName,email,username,password}=req.body
   
   if ([fullName, email, username, password].some((field) => {
       return field?.trim() == "";
   })){
       throw new ApiError(400,"all fields are required ");
   }

   const exitedUser= await User.findOne({
       $or:[
           {username},
           {email}

       ]
   })
   if(exitedUser){
    
       throw new ApiError(409,"User already exists");
   }
   //res.body is given by express 
   // as we added midlle of multer in route so that it get further more option like res.files
   
   const avatarLocalPath=req.files?.avatar[0]?.path;

   
   if(!avatarLocalPath){
       throw new ApiError(400,"Avatar file required ");
   }
   
   const avatar=await uploadOnCloudinary(avatarLocalPath);
   
   
   if(!avatar){
       throw new ApiError(500,"Failed to upload avatar image");
   }

   const user=await User.create({
       fullName,
       avatar:avatar.url,
       email,
       username:username.toLowerCase(),
       password,
   });
 
   const createdUser=await User.findById(user._id).select("-password -refreshToken");
   
   if(!createdUser){
       throw new ApiError(500,"Failed to create user");
   }
   


   return res.status(201).json(
       //can be done only by created user
       new ApiResponse(200,createdUser,"User created successfully")
   )

   

});
const loginUser=asyncHandler(async(req,res)=>{
    // req body ->data
    //username or email
    //find the user 
    //password check
    //accesss and refresh token
    //send cookie

    const {email,username,password}=req.body;
    
    if(!username&&!email){
        throw new ApiError(400,"username or email is required")
    }
    
    
    const user = await User.findOne({
        $or: [
            {
                username,
                email
             
            }
        ]
    }); 
  
    
    if(!user){
        throw new ApiError(404,"User not found");
    }

    
    const isPasswordValid= await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        throw new ApiError(401,"Wrong Password");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)
 

    // console.log("refreshTOken",userupdated.refreshToken); 
    // we have updated the refresh token in user by upper step but user is actually pointing to previous user even now
    // so he havnt refreh token so we have to find again for this user_id (optional step)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    //by doing this cookie only can be modified by server not by frontend
    const options={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"

        )
    )

});

const logoutUser=asyncHandler(async(req,res)=>{
    //console.log(req.body);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }

        },
        {
            new : true
        }
    )
    const options={
        httpOnly : true,
        secure : true
    }
    return res.
    status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"usser logged Out"))


})



const refreshAccessToken =asyncHandler(async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
    //console.log("req.cookies.refreshToken",req.cookies.refreshToken);
 
    if(!incomingRefreshToken){
     throw new ApiError(401,"unauthorised request");
    }
    try {
        const decodedToken=jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
        )
        //this give user info which is put with secrest to form jwt token
    
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refres token")
        }
       console.log("user",user);
        
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token is experied or used")
        }
        //now we have to change the refreshtoken and this refrefh again so cant use same token again
    
        const option=
        {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken}=await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshTOken",newRefreshToken,option)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,refreshToken: newRefreshToken,
                   
                },
                "acccess token refresh",
            )
        )
        
    } catch (error) {
        throw new ApiError(401,error?.message||"invalid refresh token")
    }
 
 
 })



 const changeCurrentPassword=asyncHandler(async(req,res)=>{
  
    const {oldPassword,newPassword}=req.body;
    const user =await User.findById(req.user?._id)
    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect ){
        throw new ApiError(400,"Invalid Password");
    }
    user.password=newPassword;
    
    await user.save({
        valdiatieBeforeSave: false 
    });

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password change successfully"))

})


const getCurrentUser=asyncHandler(async(req,res)=>{

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "user fetched suceesfully"
    ))

})


const updateAccountDetail=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body;
    if(!fullName||!email){
        throw new ApiError(400,"All field are required")
    }
    const user =await User.findByIdAndUpdate(
        req.user?._id,
        {

            $set:{
                fullName,
                email: email

            }
        },
        {new : true}
       
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"account detail updated sucessfully"))
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"AvaTatr file is missing")

    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400,"error while uploading the file")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")
 
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )


})
//for info of the random profile 
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
  
    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing");
    }
  
    const user = await User.findOne({ username: username.toLowerCase() }).select("username email avatar");
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Get counts
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: user._id }),
      Follow.countDocuments({ follower: user._id }),
    ]);
  
    // Check if current user is following the target user
    let isFollowing = false;
    if (req.user?._id) {
      const followDoc = await Follow.findOne({
        follower: req.user._id,
        following: user._id,
      });
      isFollowing = !!followDoc;
    }
  
    return res.status(200).json(
      new ApiResponse(200, {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        followersCount,
        followingCount,
        isFollowing,
      }, "User channel fetched successfully")
    );
  });

// only show the profile of user only 
// not writen for random profile

const getHostedDebateRooms = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
  
    const hostedRooms = await DebateRoom.aggregate([
      {
        $match: {
          host: userId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "host",
          foreignField: "_id",
          as: "host",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          host: { $first: "$host" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
  
    return res.status(200).json(
      new ApiResponse(200, hostedRooms, "Hosted debate rooms fetched successfully")
    );
  });


  const getPastParticipatedDebates = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    const pastDebates = await DebateRoom.aggregate([
      {
        $match: {
          status: "ended",
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "host",
          foreignField: "_id",
          as: "host",
          pipeline: [
            {
              $project: {
                username: 1,
                avatarUrl: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          host: { $first: "$host" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          scheduledAt: 1,
          status: 1,
          for: 1,
          against: 1,
          host: 1,
          participantsCount: { $size: "$participants" },
          createdAt: 1,
        },
      },
      {
        $sort: {
          scheduledAt: -1, // Most recent debates first
        },
      },
    ]);
  
    return res.status(200).json(
      new ApiResponse(200, pastDebates, "Fetched past participated debates.")
    );
  });




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    getUserChannelProfile,
    getPastParticipatedDebates,
    getHostedDebateRooms


}

