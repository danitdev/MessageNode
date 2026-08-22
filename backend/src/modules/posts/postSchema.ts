import {z} from "zod";

export const createPostSchema = z.object({
    title:z
        .string()
        .trim()
        .min(5,"Title should be a min of 5 char!")
        .max(100,"Title must be at most 100 characters"),
    content:z
        .string()
        .trim()
        .min(5,"Content should be a min of 5 char!")
        .max(5000,"Content must be at most 5000 characters.")
});
export type CreatePostInput = z.infer<typeof createPostSchema>;
