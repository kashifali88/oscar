import { errorHandler } from "../utils/errorHandler.js";
export const verifyAdmin = async(req, res, next) => {
    if(req.user.role !== "admin") {
        return next(errorHandler(403, "Access denied, admin only"))
    }
    next()
}