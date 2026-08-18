import express from "express";
import bodyParser from "body-parser";
import {router as feedRouter} from "./routes/feed.js";


const app = express();


app.use(bodyParser.json()); //application/json

app.use((req,res,next)=>{
    // give the access to send req from other origins
    //by the star we set it to everything 
    res.setHeader("Access-Control-Allow-Origin","*")
    //set the methods they can use
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
    next();
});

// GET /feed/posts
app.use("/feed",feedRouter);


app.listen(8080);