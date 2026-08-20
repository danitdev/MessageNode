
import type { Request,Response,NextFunction } from "express";
import {getPostsService,postPostService} from "./postService.js";
import {CreatePostInput} from "./postSchema.js"
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
export const postPost = async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
        try{
            const data:CreatePostInput = {
                title:req.body.title,
                content:req.body.content
            }
            const post = await postPostService(data);
            res.status(201).json({post});
        }
        catch(err){
            next(err);
        }
    }