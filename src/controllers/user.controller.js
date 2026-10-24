import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"
// import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullname, email, password, username } = req.body;

    if ([fullname, email, password, username].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.file?.path || req.files?.avatar?.[0]?.path || req.files?.avatar?.path || null;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || req.files?.coverImage?.path || null;

    const avatarUrlFromBody = typeof req.body.avatar === "string" && req.body.avatar.trim()
        ? req.body.avatar.trim()
        : Array.isArray(req.body.avatar) && req.body.avatar[0]?.trim()
            ? req.body.avatar[0].trim()
            : null;

    const coverImageUrlFromBody = typeof req.body.coverImage === "string" && req.body.coverImage.trim()
        ? req.body.coverImage.trim()
        : Array.isArray(req.body.coverImage) && req.body.coverImage[0]?.trim()
            ? req.body.coverImage[0].trim()
            : null;

    let avatar = null;
    if (avatarUrlFromBody) {
        avatar = { url: avatarUrlFromBody };
    } else if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    }

    let coverImage = null;
    if (coverImageUrlFromBody) {
        coverImage = { url: coverImageUrlFromBody };
    } else if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    if (!avatar || !avatar.url) {
        avatar = { url: process.env.DEFAULT_AVATAR_URL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=500&q=80" };
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );

});

export { registerUser };