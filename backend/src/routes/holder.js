import e from "express";
import upload from "../middlewares/multer.js";
import {
    deletePost,
    getPostItem,
    getProfile,
    getUser,
    postPosting,
    updateBio,
    updateImage,
    updatePost,
    updateUsername
} from "../controllers/holder.js";

const router = e.Router();
router.post('/addPost', upload.array('photos', 12), postPosting); //
router.post('/updatePost/:postID', updatePost); // was created but less chances of getting used
                                                // too much hassle in frontend (can only modify caption for now)
router.post('/deletePost/:postID', deletePost);
// router.post('/updateUsername', updateUsername);
router.post('/updateBio', updateBio);  //
router.post('/updateImage', upload.single('profile'), updateImage); //

router.get('/getUser', getUser);
router.get('/getProfile', getProfile); //
router.get('/getPostItem/:postID', getPostItem); //
export default router;