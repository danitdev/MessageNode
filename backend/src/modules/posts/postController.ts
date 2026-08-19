
import type { Request,Response,NextFunction } from "express";
import {getPostsService} from "./postService.js";
export const getPosts = async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
    try{
        const result = await getPostsService();
        res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}