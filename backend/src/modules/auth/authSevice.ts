import {prisma} from "../../lib/prisma.js";
import {} from "./authSchema.js";
import {AppError} from "../../errors/AppError.js";
import argon2 from "argon2";

export const registerUserService = async(name:string,email:string,password:string)=>{
    const user = await prisma.user.findUnique({where:{email:email}});
    let hashedPassword:string;
    if(user){
        throw new AppError("E-Mail address already exists!",409);
    }
    try{
        hashedPassword = await argon2.hash(password,{
            type: argon2.argon2id,
            memoryCost:65536,
            timeCost:3,
            parallelism:4
        });
    }
    catch(err){
        console.log(err);
        throw new AppError("Failed to hash password",500);
    }
    try{
        const newUser = await prisma.user.create({data:{
            email:email,
            name:name,
            password:hashedPassword
        }});
        return newUser;
    }
    catch(err){
        console.log(err);
        throw new AppError("Failed to create user",500);
    }

}

export const loginUserService = async(email:string,password:string)=>{
    let loadedUser = await prisma.user.findUnique({where:{email:email}});
    if(!loadedUser){
        throw new AppError("A user with this email couldn't be found.",404);
    }
    if(loadedUser.password){
        const isValid = await argon2.verify(loadedUser.password,password);
        if(!isValid){
            throw new AppError("Wrong password!",401);
        }
    }
};