import express from "express";
import postRoutes from "./modules/posts/postRoutes.js";
const app = express();

app.use(express.json());
app.use("feed",postRoutes);
export {app};