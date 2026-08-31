import {describe,it,expect,vi,beforeEach} from "vitest";
import {deletePostService,updatePostService} from "./postService.js";
import {prisma} from "../../lib/prisma.js";
import { deleteImage } from "../../utils/deleteImage.js";
import { deletePost } from "./postController.js";

vi.mock("../../lib/prisma.js",()=>({
    prisma:{
        post:{
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