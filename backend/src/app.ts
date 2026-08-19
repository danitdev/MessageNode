import express from "express";
import cors from "cors";
import postRoutes from "./modules/posts/postRoutes.js";
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use("/feed",postRoutes);

export {app};