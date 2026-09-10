//require('dotenv').config({path: `./env}`})
import dotenv from "dotenv";                   //alternate option of above line
import app from "./app.js";

//import mongoose from "mongoose";
//import DB_NAME from "./constants.js";
import connectDB from "./db/indexdb.js"

dotenv.config({
    path: `./env`
})





connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !! ",err);
})







// import express from "express";

// const app =express();

// (async()=>{
// try {
//     mongoose.connect(`${processs.env.MONGODB_URI}/${DB_NAME}`)
    
//     app.on("errrpr",(error)=>{
//         console.log("ERRR: ",error);
//         throw error;
//     })

//     app.listen(process.env.port,()=>{
//         console.log(`server is running on port ${process.env.PORT}`);
//     })

// } catch (error) {
//     console.error("ERROR: ",error);
//     throw err
// }

// })()