import { AppError } from "../../errors/AppError.js";
import {prisma} from "../../lib/prisma.js";
import {CreatePostInput,createPostSchema} from "./postSchema.js";
import {deleteImage} from "../../utils/deleteImage.js"
import { userInfo } from "node:os";

export const getPostsService = async(userId:number,perPage:number,currentPage:number)=>{
    const posts = await prisma.post.findMany(
    {
        
        where:{creatorId:userId},
        include:
        {
            creator:
            {
                select:
                {
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        },
        skip:(currentPage-1)*perPage,
        take:perPage
    });
    const totalItems = await prisma.post.count();

    return{
        posts,
        totalItems
    };

};
export const postPostService = async(data:CreatePostInput,imageFileName:string,userId:number)=>{;
        const post = await prisma.post.create({data:{
            title: data.title,
            imageUrl: `/images/${imageFileName}`,
            content: data.content,
            creatorId:userId,
        }});
        return post;
}
export const getPostService = async(postId:number)=>{
    return await prisma.post.findUnique(
        {
            where:{id:postId},
            include:{
                creator:{
                    select:{
                        name:true
                    }
                }
            }
        }
    );
 
}

export const updatePostService = async(
    userId:number,
    postId:number,
    updatedTitle:string,
    updatedContent:string,
    updatedImageUrl?:string)=>{
    const post = await prisma.post.findUnique({
        where:{id:postId},
        select:{id:true,imageUrl:true,creatorId:true}
    });
    //check whether post exist or not
    if(!post){throw new AppError("Couldn't find the post.",404)}
    const data:{
        title:string;
        content:string;
        imageUrl?:string;
    } = {
        title:updatedTitle,
        content:updatedContent
    };
    
    if(updatedImageUrl !== undefined){
        data.imageUrl = updatedImageUrl;
    }
    if(post.creatorId !== userId){
        throw new AppError("This post doesn't belong to this user!",403);
    }
    const updatedPost = await prisma.post.update({
        where:{id:postId},
        data:data,
        include:{
            creator:{
                select:{
                    name:true
                }
            }
        }
    });
    if(updatedImageUrl !== undefined && post.imageUrl){
        await deleteImage(post.imageUrl);
    }
    return updatedPost;

}
export const deletePostService = async(userId:number,postId:number)=>{
    const existingPost = await prisma.post.findUnique({where:{id:postId},select:{id:true,imageUrl:true,creatorId:true}});
    if(!existingPost){throw new AppError("post not found.",404);}
    if(existingPost.creatorId !== userId){ throw new AppError("This post doesn't belong to this user!",403);}
    await prisma.post.delete({where:{id:postId}});
    if(existingPost.imageUrl){
        await deleteImage(existingPost.imageUrl);
    } 
};