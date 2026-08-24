
import type { Request,Response,NextFunction } from "express";
import {getPostsService,getPostService,postPostService} from "./postService.js";
import {CreatePostInput} from "./postSchema.js"
import {AppError} from "../../errors/AppError.js"

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
export const getPost = async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
    try{
        const postId = Number(req.params.postId);
        const post = await getPostService(postId);
        console.log("cool");
        if(!post){
            throw new AppError("Post not found!",404);
        }
        res.status(200).json({message:"Post fetched.",post:post});
    }
    catch(err){
        if(err instanceof AppError){
            if(!err.statusCode){
                err.statusCode = 500;
            }
        }
        next(err);
    }
};
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
            }
            next(err);
        }
    }