import { AppError } from "../../errors/AppError.js";
import {prisma} from "../../lib/prisma.js";
import {CreatePostInput,createPostSchema} from "./postSchema.js";
import {deleteImage} from "../../utils/deleteImage.js"

export const getPostsService = async()=>{
    const posts = await prisma.post.findMany(
    {
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
        }
    });
    const totalItems = await prisma.post.count();

    return{
        posts,
        totalItems
    };

};
export const postPostService = async(data:CreatePostInput,imageFileName:string)=>{;
        const post = await prisma.post.create({data:{
            title: data.title,
            imageUrl: `/images/${imageFileName}`,
            content: data.content,
            creatorId:1,
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
    postId:number,
    updatedTitle:string,
    updatedContent:string,
    updatedImageUrl?:string)=>{
    const post = await prisma.post.findUnique({
        where:{id:postId},
        select:{id:true,imageUrl:true}
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
export const deletePostService = async(postId:number)=>{
    const existingPost = await prisma.post.findUnique({where:{id:postId},select:{id:true,imageUrl:true}});
    if(!existingPost){throw new AppError("post not found.",404);}
    await prisma.post.delete({where:{id:postId}});
    if(existingPost.imageUrl){
        await deleteImage(existingPost.imageUrl);
    } 
};