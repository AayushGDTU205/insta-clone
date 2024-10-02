import e from "express";
import {
    getFeed,
    getPostItem,
    getProfile,
    getUsers,
    postComment,
    postDeleteComment,
    postFollow,
    postLike,
    postUnfollow,
    postUnlike
} from "../controllers/follower.js";

const router = e.Router();
router.post('/follow', postFollow); //
router.post('/unfollow', postUnfollow); //
router.post('/like/:postID', postLike); //
router.post('/unlike/:postID', postUnlike); //
router.post('/comment/:postID', postComment); //
router.post('/delComment/:postID/:commentID', postDeleteComment); // is created but will not be used (might be considered in future)
                                                                  // needs certain logic in frontend to work
                                                                  // can be used if correct frontend logic is sorted out

router.get('/getProfile', getProfile); //
router.get('/getPostItem/:postID', getPostItem);//
router.get('/feed', getFeed); //
router.get('/getUsers', getUsers); //
export default router;