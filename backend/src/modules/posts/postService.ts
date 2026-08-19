import {prisma} from "../../lib/prisma.js";

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
