import express from "express";
import cors from "cors";
import multer, { Multer } from "multer";
import postRoutes from "./modules/posts/postRoutes.js";
import authRoutes from "./modules/auth/authRoutes.js";
import statusRoutes from "./modules/status/statusRoutes.js";
import path from "path";
import __root_dir from "./utils/path.js";
import {AppError} from "./errors/AppError.js";
import helmet from "helmet";
import compression from "compression";

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
//adding the /images folder as a static folder
app.use("/images",express.static(path.join(__root_dir,"/images")))
app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use("/feed",postRoutes);
app.use("/auth",authRoutes);
app.use(statusRoutes);

app.use((error:AppError,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const errStatus = error.statusCode;
    const errMsg = error.message;
    console.log(error);
    res.status(errStatus).json({message:errMsg});
});


export {app};