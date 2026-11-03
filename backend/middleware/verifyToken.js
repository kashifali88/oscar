import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"


// verify token 
export const verifyToken = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token) return next(errorHandler(401, "Not authorized"))
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedToken._id);
          if (!user) return next(errorHandler(404, "User not found"));
        req.user = user;
        next();
}

