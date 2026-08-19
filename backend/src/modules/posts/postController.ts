
import type { Request,Response,NextFunction } from "express";
import {getPostsService} from "./postService.js";
export const getPosts = async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
    try{
        const {posts,totalItem} = await getPostsService();
        
    }
    catch(err){
        next(err);
    }
}