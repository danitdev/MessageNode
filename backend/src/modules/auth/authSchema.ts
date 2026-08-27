import {z} from "zod";

export const registerUserSchema = z.object({
    name:z
        .string()
        .trim()
        .min(5,"Name should be a min of 5 char!")
        .max(40,"Name must be at most 40 characters."),
    email:z
        .email("Invalid Email Address!")
    ,
    password:z
        .string()
        .min(8,"password must be at least 8 characters.")
});
export const loginUserSchema = z.object({
    email:z
        .email("Invalid Email Address!")
    ,
    password:z
        .string()
        .min(8,"password must be at least 8 characters.")
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;