import { Error } from "mongoose";
import user from "../models/user.js";
import { uploadBatchOnCloudinary, uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postPosting = responseHandler(async (req, res, next) => {
    const { caption } = req.body;
    try {
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(401, 'Unauthorized Access : terminated to move forward');
        }
        let files = req.files;
        console.log(files);
        let responses =await uploadBatchOnCloudinary(files);
        // console.log("responses: ",responses);
        let resArray = [];
        responses.map((respond) => {
            let image = {
                url:respond.url
            }
            resArray.unshift(image);
        })
        const newPost = {
            user:User.username,
            caption: caption,
            files:resArray,
            likes: 0,
            comments: 0
        }
        User.posts.unshift(newPost);
        await User.save();
        return res.status(200).json({
            message: 'post added succesfully',
            data:User.posts
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
export const updatePost = responseHandler(async (req, res, next) => {
    const { caption } = req.body;
    const { postID } = req.params;
    try {
        // console.log(req.body);
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(401, 'Unauthorized Access : terminated to move forward');
        }
        const indx = User.posts.findIndex(post => post._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'Post Does Not Exist');
        }
        User.posts[indx].caption = caption;
        await User.save();
        return res.status(200).json({
            message: 'post edited succesfully',
            data: User.posts[indx]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const deletePost = responseHandler(async (req, res, next) => {
    const { postID } = req.params;
    try {
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(401, 'Unauthorized Access : terminated to move forward');
        }
        const indx = User.posts.findIndex(post => post._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'Post Does Not Exist');
        }
        User.posts.splice(indx, 1);
        await User.save();
        return res.status(200).json({
            message: 'post deleted succesfully',
            data:User.posts
        })
     } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
     }
})
export const updateUsername = responseHandler(async (req, res, next) => {
    //need to fix up other parts of project like verifyJWT and certain
    //functions in controller to have this work smoothly
    // issue - since token are signing with username and verified with username
    // on performing anything after changing username will lead to verifyJWT
    // throwing an error 
    const { username } = req.body;
    // console.log(hey);
    try {
        // console.log(hey);
        console.log(req.user);
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(400, 'unauthorized access');
        }
        let finder = await user.findOne({ username: username });
        if (finder) {
            throw new ErrorHandler(404, 'username not available try another one');
        }
        User.username = username.toLowerCase();
        await User.save();
        res.status(200).json({
            message: 'username updated succesfully',
            data: User
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
export const updateBio = responseHandler(async (req, res, next) => {
    const { bio } = req.body;
    try {
        let User = await user.findById(req.user._id);
        if(!User){
            throw new ErrorHandler(400, 'user not exist');
        }
        User.bio = bio;
        await User.save();
        res.status(200).json({
            message: 'bio updated succesfully',
            data:User
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
export const updateImage = responseHandler(async (req, res, next) => {
    try {
        let User = await user.findById(req.user._id);
        if(!User){
            throw new ErrorHandler(400, 'user not exist');
        }
        // console.log(User);
        let response =await uploadOnCloudinary(req.file.path);
        // console.log(response.url);
        User.profileImage = response.url;
        await User.save();
        // console.log(User);
        res.status(200).json({
            message: 'image updated succesfully',
            data:User
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const getProfile = responseHandler(async (req, res, next) => {
    try {
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(404, 'user not found');
        }
        res.status(200).json({
            message: 'profile obtained',
            data:User
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const getPostItem = responseHandler(async (req, res, next) => {
    const { postID } = req.params;
    
    try { 
        let User = await user.findById(req.user._id);
        if (!User) {
            throw new ErrorHandler(404, 'user not found');
        }
        const indx = User.posts.findIndex(post => post._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'Post Does Not Exist');
        }
        res.status(200).json({
            message: 'post obtained',
            data:User.posts[indx]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const getUser = responseHandler(async (req, res, next) => {
    try {
        console.log('user here');
        if (!req.user) {
            return res.status(404).json({
                message: 'not logged in',
                isLoggedIn: false
            })
        }
        
        res.status(200).json({
            message: 'logged in',
            isLoggedIn: true,
           data:req.user
        })
     } catch (error) {
        throw new ErrorHandler(500 || error.statusCode, 'cannot get user');
    }
})