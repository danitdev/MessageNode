import {Router} from "express";
import {getPosts,getPost,postPost,updatePost,deletePost} from "./postController.js";
import {createPostSchema} from "./postSchema.js";
import { validate } from "../../middleware/validate.js";
import {isAuth} from "../../middleware/isAuth.js";


const router = Router();

router.get("/posts",isAuth,getPosts);
router.post("/post",isAuth,validate(createPostSchema),postPost)
router.get("/post/:postId",isAuth,getPost);
router.put("/post/:postId",isAuth,validate(createPostSchema),updatePost);
router.delete("/post/:postId",isAuth,deletePost);

export default router;