import {describe,it,expect,vi,beforeEach} from "vitest";
import {deletePostService} from "./postService.js";
import {prisma} from "../../lib/prisma.js";

vi.mock("../../lib/prisma.js",()=>({
    prisma:{
        post:{
            findUnique: vi.fn(),
            delete:vi.fn()
        }
    }
}));
vi.mock("../../utils/deleteImage.js",()=>({
    deleteImage:vi.fn()
}));

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
        vi.mocked(prisma.post.findUnique).mockResolvedValueOnce({
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
    })
});