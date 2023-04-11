import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";


export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers["auth-token"] &&
        req.headers["auth-token"].startsWith("Bearer")
    ) {
        try {
            token = req.headers["auth-token"].split(" ")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized,no token");
    }
})
