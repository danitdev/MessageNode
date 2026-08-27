
import type { Request,Response,NextFunction } from "express";
import {getPostsService,getPostService,postPostService,updatePostService,deletePostService} from "./postService.js";
import {CreatePostInput} from "./postSchema.js"
import {AppError} from "../../errors/AppError.js"
import {deleteImage} from "../../utils/deleteImage.js";
import { prisma } from "../../lib/prisma.js";
export const getPosts = async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
    try{
        const currentPage = Number(req.query.page) || 1;
        const perPage = 2;
        const result = await getPostsService(req.userId!,perPage,currentPage);
        res.status(200).json(
            {
                message:"Fetched posts successfully",
                posts:result.posts, 
                totalItems:result.totalItems
            });
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
            console.log(req.file);
            if(!req.file){
                throw new AppError("No Image Provided",422);
            }
            const data:CreatePostInput = {
                title:req.body.title,
                content:req.body.content,
            }
            const post = await postPostService(data,req.file.filename,req.userId!);
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
export const updatePost = async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
        try{
            const postId = Number(req.params.postId);
            const updatedTitle = req.body.title;
            const updatedContent = req.body.content;
            let updatedImageUrl: string | undefined;
            if(req.file){
                updatedImageUrl = `/images/${req.file.filename}`
            }
            const updatedPost = await updatePostService(req.userId!,postId,updatedTitle,updatedContent,updatedImageUrl);
            if(updatedPost){
                res.status(200).json({message:"Post Updated!",post:updatedPost});
            }
        }
        catch(err){
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode=500;
                }
            }
            next(err);
        }
}
export const deletePost = async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
        try{
            const postId = Number(req.params.postId);
            await deletePostService(req.userId!,postId);
            res.status(200).json({message:"deleted post."})
        }
        catch(err){
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode=500;
                }
            }
            next(err);
        }
        
        
    }