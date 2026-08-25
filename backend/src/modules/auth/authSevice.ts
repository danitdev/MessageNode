import {prisma} from "../../lib/prisma.js";
import {} from "./authSchema.js";
import {AppError} from "../../errors/AppError.js";


export const registerUserService = async(name:string,email:string,password:string)=>{
    const user = await prisma.user.findUnique({where:{email:email}});
    if(user){
        throw new AppError("E-Mail address already exists!",503);
    }

}