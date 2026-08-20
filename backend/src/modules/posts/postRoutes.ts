import {Router} from "express";
import {getPosts,postPost} from "./postController.js";
import {createPostSchema} from "./postSchema.js";
import { validate } from "../../middleware/validate.js";
const router = Router();

router.get("/posts",getPosts);
router.post("/post",validate(createPostSchema),postPost)


export default router;