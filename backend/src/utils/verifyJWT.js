import ErrorHandler from "./ErrorHandler.js";
import { responseHandler } from "./responseHandler.js";
import user from "../models/user.js";
import jwt from "jsonwebtoken";

export const verifyJWT = responseHandler(async (req, res, next) => {
    const incomingAccessToken = req.cookies.accessToken;
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingAccessToken || !incomingRefreshToken) {
        throw new ErrorHandler(400, 'you are not logged in to perform this action');
    }
    try {
        const decode = jwt.verify(incomingAccessToken, process.env.ACCkey);
        let User =await user.findOne({ username: decode.username });

        // console.log(User);
        // console.log(User.refreshToken);
        if (!User || User.refreshToken !== incomingRefreshToken) {
            throw new ErrorHandler(400, 'Unauthorized access');
        }
        req.user = User;
        next();
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})