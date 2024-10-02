import user from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { responseHandler } from "../utils/responseHandler.js";

export const postFollow = responseHandler(async (req, res, next) => {
    const { username } = req.body;
    const  newFollower = req.user;
    try {
        // console.log(username);
        // console.log(newFollower);
        const User =await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(400, 'the account you are trying to follow does not exist');
        }
        if (User.username === newFollower.username) {
            throw new ErrorHandler(400, 'You cannot follow yourself');
        }
        const newFollow = newFollower.username;
        const indx_follower = User.followers.findIndex(e => e.user_name === newFollow);
        const indx_following = newFollower.following.findIndex(e => e.user_name === User.username);
        // console.log(indx);
        if (indx_follower !== -1 || indx_following !== -1) {
            throw new ErrorHandler(400, 'Account already followed');
        }
        const addedFollower = {
            user_name: newFollower.username
        }
        let preFollow = +newFollower.following_count;
        preFollow = preFollow + 1;
        const addedFollowing = {
            user_name:User.username
        }
        let preFollowing = +User.follower_count;
        preFollowing = preFollowing + 1;
        newFollower.following.unshift(addedFollowing);
        newFollower.following_count = preFollow;
        await newFollower.save();
        User.followers.unshift(addedFollower);
        User.follower_count = preFollowing;
        await User.save();

        return res.status(200).json({
            message: 'followed successfully',
            data: [User, newFollower]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message || 'unable to follow due to server error');      
    }
})

export const postUnfollow = responseHandler(async (req, res, next) => {
    const { username } = req.body;
    const  newFollower = req.user;
    try {
        // console.log(username);
        // console.log(newFollower);
        const User =await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(400, 'the account you are trying to follow does not exist');
        }
        if (User.username === newFollower.username) {
            throw new ErrorHandler(400, 'You cannot unfollow yourself');
        }
        const newFollow = newFollower.username;
        const indx_follower = User.followers.findIndex(e => e.user_name === newFollow);
        const indx_following = newFollower.following.findIndex(e => e.user_name === User.username);
        // console.log(indx);
        if (indx_follower === -1 || indx_following===-1) {
            throw new ErrorHandler(400, 'Account already not followed');
        }
        
        newFollower.following.splice(indx_following, 1);
        let preFollow = +newFollower.following_count;
        preFollow = preFollow - 1;
        newFollower.following_count = preFollow;
        await newFollower.save();
        User.followers.splice(indx_follower, 1);
        let preFollowing = +User.follower_count;
        preFollowing = preFollowing - 1;
        User.follower_count = preFollowing;
        await User.save();

        return res.status(200).json({
            message: 'unfollowed successfully',
            data: [User, newFollower]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message || 'unable to follow due to server error');      
    }
})

export const postLike = responseHandler(async (req, res, next) => {
    const { postID } = req.params;
    const { username } = req.body;
    console.log(postID);
    try {
        let User = await user.findOne({ username: username });
        console.log(User);
        if (!User) {
            throw new ErrorHandler(400, 'account does not exist');
        }
        let indx = User.posts.findIndex(e => e._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'no such post exists');
        }
        let likeIndx = User.posts[indx].likers.findIndex(e => e.user === req.user.username);
        if (likeIndx !== -1) {
            throw new ErrorHandler(400, 'post already liked');
        }
        let postLike = +User.posts[indx].likes;
        postLike = postLike + 1;
        const newLiker = {
            user: req.user.username
        }
        User.posts[indx].likes = postLike;
        User.posts[indx].likers.unshift(newLiker);
        await User.save();
        res.status(200).json({
            message: 'post liked succesfully',
            data: User.posts[indx]
        })
     } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message || 'cant like right now');
    }
})

export const postUnlike = responseHandler(async (req, res, next) => {
    const { postID } = req.params;
    const { username } = req.body;
    try {
        let User = await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(400, 'account does not exist');
        }
        let indx = User.posts.findIndex(e => e._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'no such post exists');
        }
        let postUnLike = +User.posts[indx].likes;
        postUnLike = postUnLike - 1;
        let userIndx = User.posts[indx].likers.findIndex(e => e.user === req.user.username);
        if (userIndx === -1) {
            throw new ErrorHandler(400, 'post not liked');
        }
        User.posts[indx].likes = postUnLike;
        User.posts[indx].likers.splice(userIndx,1);
        await User.save();
        res.status(200).json({
            message: 'post unliked succesfully',
            data: User.posts[indx]
        })
     } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message || 'cant like right now');
    }
})

export const postComment = responseHandler(async (req, res, next) => {
    const { postID } = req.params;
    const { username,message } = req.body;
    try {
        let User = await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(404, 'account does not exist');
        }
        let indx = User.posts.findIndex(e => e._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'no such post exists');
        }
        let postComment = +User.posts[indx].comments;
        postComment = postComment + 1;
        User.posts[indx].comments = postComment;
        const newComment = {
            user: req.user.username,
            message: message
        }
        User.posts[indx].commenters.unshift(newComment);
        await User.save();
        res.status(200).json({
            message: 'comment added succesfully',
            data: User.posts[indx]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const postDeleteComment = responseHandler(async (req, res, next) => {
    const { postID,commentID } = req.params;
    const { username} = req.body;
    try {
        let User = await user.findOne({ username: username });
        if (!User) {
            throw new ErrorHandler(404, 'account does not exist');
        }
        if (req.user.username === User.username) {
            throw new ErrorHandler(400, 'unauthorized access');
        }
        let indx = User.posts.findIndex(e => e._id.toString() === postID.toString());
        if (indx === -1) {
            throw new ErrorHandler(400, 'no such post exists');
        }
        let postComment = +User.posts[indx].comments;
        postComment = postComment - 1;
        User.posts[indx].comments = postComment;
        let commentIndx = User.posts[indx].commenters.findIndex(e => e._id.toString() === commentID.toString());
        if (commentIndx === -1) {
            throw new ErrorHandler(404, 'comment does not exist');
        }
        User.posts[indx].commenters.splice(commentIndx, 1);
        await User.save();
        res.status(200).json({
            message: 'comment deleted succesfully',
            data: User.posts[indx]
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
export const getUsers = responseHandler(async(req, res, next)=> {
    const { text } = req.query;
    try {
        
        let Users =await user.find({ username: { $regex: text } });
        if (!Users) {
            throw new ErrorHandler(404, 'Users not found');
        }
        let User = [];
        if (Users.length) {
            for (let i = 0; i < Users.length; i++){
                User.unshift(Users[i].username);
            }
        }
        
        
        res.status(200).json({
            message: 'users found succesfully',
            data:User
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
export const getProfile = responseHandler(async (req, res, next) => {
    const { username } = req.query;
    // console.log("get profile ke andar:", username);
    try {
        let User = await user.findOne({username:username});
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
    const { username } = req.query;
    try { 
        let User = await user.findOne({ username: username });
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


export const getFeed = responseHandler(async (req, res, next) => {
    try {
        let User = await user.findById(req.user._id);
        if(!User){
            throw new ErrorHandler(400, 'user not exist');
        }
        // console.log(User.following.length);
        let Feed = [];
        for (let i = 0; i < User.following.length; i++){
            // console.log(User.following[i]);
            let following = await user.findOne({ username: User.following[i].user_name });
            // console.log(following)
            Feed = [...Feed, ...following.posts];
        }
        // console.log(Feed);
        res.status(200).json({
            message: 'feed obtained',
            data:Feed
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})
