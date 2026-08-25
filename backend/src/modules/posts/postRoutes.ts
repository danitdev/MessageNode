import {Router} from "express";
import {getPosts,getPost,postPost,updatePost} from "./postController.js";
import {createPostSchema} from "./postSchema.js";
import { validate } from "../../middleware/validate.js";
const router = Router();

router.get("/posts",getPosts);
router.post("/post",validate(createPostSchema),postPost)
router.get("/post/:postId",getPost);
router.put("/post/:postId",validate(createPostSchema),updatePost);

export default router;