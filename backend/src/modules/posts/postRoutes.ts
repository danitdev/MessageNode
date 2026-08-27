import {Router} from "express";
import {getPosts,getPost,postPost,updatePost,deletePost} from "./postController.js";
import {createPostSchema} from "./postSchema.js";
import { validate } from "../../middleware/validate.js";
import {isAuth} from "../../middleware/isAuth.js";


const router = Router();

router.get("/posts",isAuth,getPosts);
router.post("/post",validate(createPostSchema),postPost)
router.get("/post/:postId",getPost);
router.put("/post/:postId",validate(createPostSchema),updatePost);
router.delete("/post/:postId",deletePost);

export default router;