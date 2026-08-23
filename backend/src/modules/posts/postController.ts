
import type { Request,Response,NextFunction } from "express";
import {getPostsService,postPostService} from "./postService.js";
import {CreatePostInput} from "./postSchema.js"
import {AppError} from "../../errors/AppError.js"
import { errorMonitor } from "events";

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
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            }
        }
    }