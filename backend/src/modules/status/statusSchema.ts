import {z} from "zod";


export const checkStatusSchema = z.object({
    status:z
        .string()
        .trim()
        
});
export type CheckStatusSchema = z.infer<typeof checkStatusSchema>;