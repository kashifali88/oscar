
import express from "express";
import {
    deleteUser,
    fetchUser,
    updateUser
} from "../controllers/userController.js";

import { verifyToken } from "../../backend/middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/fetch", verifyToken, fetchUser);
userRouter.put("/update", verifyToken, updateUser);
userRouter.delete("/delete", verifyToken, deleteUser);

export default userRouter;
