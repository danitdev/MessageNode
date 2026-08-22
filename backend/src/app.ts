import express from "express";
import cors from "cors";
import multer, { Multer } from "multer";
import postRoutes from "./modules/posts/postRoutes.js";


const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");

    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    }
});



const upload = multer({storage:multer.memoryStorage()});
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use("/feed",postRoutes);

export {app};