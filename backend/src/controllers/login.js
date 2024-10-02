import user from "../models/user.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const tokenGenerators = async (userID) => {
    try {
        console.log('hi');
        const User = await user.findById(userID);
        // console.log(User);
        const accessToken = await User.generateAccessToken();
        // console.log(accessToken);
        const refreshToken = await User.generateRefreshToken();
        // console.log(refreshToken);
        User.refreshToken = refreshToken;

        await User.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ErrorHandler(400, 'token generation unsuccessful');
    }
    
    
}

export const postSignup = responseHandler(async (req, res, next)=> {
    const { username, password, fullname, email, bio } = req.body;
    const reqFields = ["username", "password", "fullname", "email","bio"];
    const bodyFields = Object.keys(req.body);
    const missing = reqFields.filter((field) => {
        if (!bodyFields.includes(field)) return true;
        else return false;
    })
    if (missing.length > 0) {
        throw new ErrorHandler(400, 'Certain fields missing');
    }
    try {
        let User =await user.findOne({
            $and: [
                { username },
                { email }
            ]
        })
        // console.log(User);
        if (User) {
            throw new ErrorHandler(402, 'User already exists, try new username or email');
        }
        console.log(req.file);
        const response =await uploadOnCloudinary(req.file.path);
        // console.log(response.url);
        let newUser=await user.create({
            username:username.toLowerCase(),
            email:email.toLowerCase(),
            password,
            bio,
            fullname: fullname.toLowerCase(),
            profileImage: response.url,
            follower_count: 0,
            following_count: 0
        })
        return res.status(200).json({
            message: 'user created succesfully',
            data:newUser
        })
    } catch (error) {
        throw new ErrorHandler(500 || error.statusCode, error.message);
    }
})

export const postLogin = responseHandler(async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const User = await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(400, 'Not a user, kindly sign in');
        }
        // console.log(User);
        const match = await bcrypt.compare(password, User.password);
        console.log(match);
        if(!match) {
            throw new ErrorHandler(402, 'incorrect password');
        }
        const { accessToken, refreshToken } =await tokenGenerators(User._id);
        // console.log('hi2');
        
        const existing = await user.findOne({ _id: User._id }).select("-refreshToken -password");
        // console.log("access:", accessToken, "refresh:", refreshToken);
        // console.log(existing);
        if (!accessToken || !refreshToken) {
            throw new ErrorHandler(500, 'token are not set');
        }
        const userToken = req.header.authToken;
        const options = {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 31557600),
            secure:true,
            sameSite:'none',
            }
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: 'logged in successfully',
                data: existing,
                authToken:refreshToken
            })
    } catch (error) {
        // console.log(error.message);
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const postLogout = responseHandler(async (req, res, next) => {
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: 'none',
        });
        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: 'none',
        });
        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        throw new ErrorHandler(500, 'logout failure');
    }
})