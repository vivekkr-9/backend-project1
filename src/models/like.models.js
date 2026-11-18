import mongoose,{Schema} from "mongoose";

const likeSchema = new mongoose.Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },

    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },

    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    // get tweet() {
    //     return this._tweet;
    // },
    // set tweet(value) {
    //     this._tweet = value;
    // },
    
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema);