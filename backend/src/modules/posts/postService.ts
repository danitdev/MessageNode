import {prisma} from "../../lib/prisma.js";

export const getPostsService = async()=>{
    const [posts,totalItem] = await Promise.all([prisma.post.findMany(),prisma.post.count()]);
    return{
        posts,
        totalItem
    };
};