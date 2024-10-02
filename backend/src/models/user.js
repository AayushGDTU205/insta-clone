import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    bio: {
        type: String  
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    profileImage: {
        type: String
    },
    refreshToken:String,
    follower_count: Number,
    following_count: Number,
    followers: [{ user_name: String }],
    following: [{ user_name: String }],
    posts: [
        {
            user: String,
            likes: Number,
            comments: Number,
            likers: [{ user: String }],
            commenters: [{ user: String, message: String }],
            files: [{ url: String }],
            caption:String,
            date: { type: Date, default: Date.now }
        }
    ]
});

userSchema.pre('save', function (next) {
    if (!this.isModified("password")) return next();

    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            next(err);
        }
        user.password = hash;
        next();
    });  
});

userSchema.method('generateRefreshToken', async function () {
    console.log('hello');
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.REFkey,
        {
            expiresIn: "30d"
        }
    )
});
userSchema.method('generateAccessToken', async function () {
    return jwt.sign(
        {
            userId: this._id,
            username: this.username,
            fullname: this.fullname,
            email:this.email
        },
        process.env.ACCkey,
        {
            expiresIn:"1d"
        }
    )
})



let user = mongoose.model("user", userSchema);
export default user;

