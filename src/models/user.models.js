import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required :true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type: String,
        required :true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type: String,
        required :true,
        trim:true,
        index:true,
    },
    avatar:{
        type: String,       //cloudnary url ,it is like aws
        default: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=500&q=80",
    },
    coverImage:{
        type: String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    password:{
        type:String,
        required:[true, 'Password is required'],
    },
    refreshToken:{
        type:String
    }


},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        },
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        },
    )
}
userSchema.methods.generateRefreshToken = function(){}


export const User = mongoose.model("User",userSchema);