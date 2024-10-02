import express from "express";
import upload from "../middlewares/multer.js";
import {
    postLogin,
    postLogout,
    postSignup
} from "../controllers/login.js";

const router = express.Router();
router.post('/signup', upload.single('profile'),postSignup); //
router.post('/login', postLogin); //
router.post('/logout', postLogout);

export default router;