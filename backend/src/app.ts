import express from "express";
import cors from "cors";
import multer, { Multer } from "multer";
import postRoutes from "./modules/posts/postRoutes.js";

//file storage declared
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");

    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    }
});
//file filter defined
const fileFilter = (req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}


const upload = multer({storage:fileStorage,fileFilter:fileFilter}).single("image");
const app = express();

//setting the upload for app to use
app.use(upload);
app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.json());
app.use("/feed",postRoutes);

export {app};