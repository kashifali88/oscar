import express from "express";
import dotenv from 'dotenv';
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import multer from 'multer';
import { v2 as cloudinary } from "cloudinary";
import streamifier from 'streamifier';

dotenv.config();

// cloud config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// multer setup using memory storage
const storage = multer.memoryStorage();
const upload  = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), catchAsyncError(async(req, res, next) => {
if(!req.file) return next(errorHandler(404, 'No file uploaded'))
    // function to handle the stream upload to cloudinary
const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if(result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        // pipe the bufferFile to the stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
};
//   call the streamUpload function with the file buffer
const result = await streamUpload(req.file.buffer);
res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: result.secure_url
})

}))
export default router;