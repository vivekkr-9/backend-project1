import {asyncHandler} from "../utils/asyncHandler.js";
import {Apierror} from "../utils/ApiError.js";
import {user} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"done"
    // })

    const {fullname,email,password,}= req.body;
    console.log("fullname: ",fullname);

    // if(fullname == ""){
    //     throw new Apierror(400,"fullname is required");
    // }
    
    if([fullname,email,password,username].some((field)=>  field?.trim() === "")){
        throw new Apierror(400,"All fields are required");
    }

    const userExisted=user.findOne({
        $or:[{username},{email}]
    })

    if(userExisted){
        throw new Apierror(409,"User already exists")
    }

    const avatarLocalPath=req.file?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new Apierror(400,"Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new Apierror(400,"Avatar file is required")
    }

    const user = await user.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase,
    })

    const createdUser = await user.findById(user._id).selct(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new Apierror(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        mew ApiResponse(200,createdUser,"User registered successfully")
    )

})

export {registerUser};