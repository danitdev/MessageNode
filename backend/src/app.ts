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
const fileFilter = (req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}


const upload = multer({storage:multer.memoryStorage()});
const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use("/feed",postRoutes);

export {app};