import {describe,it,expect,vi,beforeEach} from "vitest";
import {deletePostService,updatePostService,getPostService,getPostsService,postPostService} from "./postService.js";
import {prisma} from "../../lib/prisma.js";
import { deleteImage } from "../../utils/deleteImage.js";
import { deletePost } from "./postController.js";

vi.mock("../../lib/prisma.js",()=>({
    prisma:{
        post:{
            findMany:vi.fn(),
            count:vi.fn(),
            create:vi.fn(),
            findUnique: vi.fn(),
            delete:vi.fn(),
            update:vi.fn()
        }
    }
}));
vi.mock("../../utils/deleteImage.js",()=>({
    deleteImage:vi.fn()
}));
describe("updatePostService",()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
    });
    it("throws 404 when the post doesn't exists",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue(null);
        await expect(
            updatePostService(1,10,"testTitle","testContent","./test")
        ).rejects.toMatchObject({
            message:"Couldn't find the post.",
            statusCode:404
        })
    });
        it("throws 403 when the post doesn't belong to user",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
            id:10,
            title:"test post",
            content:"test content",
            imageUrl:null,
            createdAt:new Date(),
            creatorId:12
        });
        await expect(
            updatePostService(2,10,"new title","new content")
        ).rejects.toMatchObject({
            message:"This post doesn't belong to this user!",
            statusCode:403
        });
        expect(prisma.post.update).not.toHaveBeenCalled();
    });
    it("updates the post successfully",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
            id:10,
            content:"test content",
            title:"test title",
            imageUrl:null,
            createdAt:new Date(),
            creatorId:1
        });
        const updatedPost = {
            id:10,
            title:"new title",
            content:"new content",
            imageUrl:null,
            createdAt:new Date(),
            creatorId:1,
            creator:{
                name:"John"
            }
        };
        vi.mocked(prisma.post.update).mockResolvedValue(updatedPost);
        const result = await updatePostService(1,10,"new title","new content");
        expect(result).toEqual(updatedPost);
        expect(prisma.post.update).toHaveBeenCalledWith({
            where:{
                id:10
            },
            data:{
                title:"new title",
                content:"new content"
            },
            include:{
                creator:{
                    select:{
                        name:true
                    }
                }
            }
        });
        expect(deleteImage).not.toHaveBeenCalled();
    });
    it("updates the post and delete the old image when a new image is provided",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
            id:10,
            content:"test content",
            title:"test title",
            createdAt:new Date(),
            creatorId:1,
            imageUrl:"/images/old.jpg"
        });
        const updatedPost = {
            id:10,
            content:"new content",
            title:"new title",
            imageUrl:"/images/new.jpg",
            creatorId:1,
            createdAt:new Date(),
            creator:{
                name:"john"
            }
        };
        vi.mocked(prisma.post.update).mockResolvedValue(updatedPost);
        const result = await updatePostService(1,10,"new title","new content","/images/new.jpg");
        expect(result).toEqual(updatedPost);
        expect(prisma.post.update).toHaveBeenCalledWith({
            where:{
                id:10,
            },
            data:{
                title:"new title",
                content:"new content",
                imageUrl:"/images/new.jpg"
            },
            include:{
                creator:{
                    select:{
                        name:true
                    }
                }
            }
        });
        expect(deleteImage).toHaveBeenCalledWith("/images/old.jpg");
    })
    
})
describe("deletePostService",()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
    });
    it("throws 404 when the post doesn't exits",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue(null);
        await expect(
            deletePostService(1,10)
        ).rejects.toMatchObject({
            message:"post not found.",
            statusCode:404
        });
    });
    it("throws 403 when the post doesn't belong to user",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
            id: 10,
            title: "Test post",
            content: "Test content",
            imageUrl: null,
            createdAt: new Date(),
            creatorId: 2,
        });
        await expect(deletePostService(1,10)).rejects.toMatchObject({
            message:"This post doesn't belong to this user!",
            statusCode:403
        });
    });
    it("deletes the post when the user owns it",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
            id: 10,
            title: "Test post",
            content: "Test content",
            imageUrl: null,
            createdAt: new Date(),
            creatorId: 1,

        });
        vi.mocked(prisma.post.delete).mockResolvedValue({} as any);
        await deletePostService(1,10);
        expect(prisma.post.delete).toHaveBeenCalledWith({
            where:{
                id:10
            }
        });
        expect(deleteImage).not.toHaveBeenCalled();
    });
    it("deletes the post and its image when the user owns it",async()=>{
        vi.mocked(prisma.post.findUnique).mockResolvedValue({
        id: 10,
        title: "Test post",
        content: "Test content",
        imageUrl: "/images/test.jpg",
        createdAt: new Date(),
        creatorId: 1,
        });
        vi.mocked(prisma.post.delete).mockResolvedValue({} as any);
        await deletePostService(1,10);
        expect(prisma.post.delete).toHaveBeenCalledWith({
            where:{
                id:10
            }
        });
        expect(deleteImage).toHaveBeenCalledWith("/images/test.jpg");
    });
});