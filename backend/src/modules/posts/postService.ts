import {prisma} from "../../lib/prisma.js";
import {CreatePostInput,createPostSchema} from "./postSchema.js";
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
export const postPostService = async(data:CreatePostInput)=>{;
        const post = await prisma.post.create({data:{
            title: data.title,
            content: data.content,
            creatorId:1,
        }});
        return post;
}
export const getPostService = async(postId:number)=>{
    return await prisma.post.findUnique({where:{id:postId}});
 
}