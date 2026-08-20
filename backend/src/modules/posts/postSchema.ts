import {z} from "zod";

export const createPostSchema = z.object({
    title:z
        .string()
        .trim()
        .min(1,"Title is required!")
        .max(100,"Title must be at most 100 characters"),
    content:z
        .string()
        .trim()
        .min(1,"Content is required!")
        .max(5000,"Content must be at most 5000 characters.")
});
export type CreatePostInput = z.infer<typeof createPostSchema>;
