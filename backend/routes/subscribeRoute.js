import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import express from "express";
import Subscriber from '../models/subscribeModel.js'

const router = express.Router();

router.post("/", catchAsyncError(async(req, res, next) => {
const { email } = req.body;
if(!email) return next (errorHandler(404, 'No email found'));
let subscriber = await Subscriber.findOne({ email});
if (subscriber) return next(errorHandler(400, 'Email is already subscribed'));

// create new subscriber
subscriber = new Subscriber({email});
await subscriber.save();
res.status(201).json({success: true, message: "Successfully subscribed to the newsletter"})
}))


export default router;