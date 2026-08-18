import e from "express"
import { getPosts, postPost } from "../controllers/feed.js";
const router = e.Router();

router.get("/posts",getPosts);
router.post("/post",postPost);

export{router};