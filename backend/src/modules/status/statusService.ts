import { AppError } from "../../errors/AppError.js";
import {prisma} from "../../lib/prisma.js";


export const getStatusService = async(userId:number)=>{
    const user = await prisma.user.findUnique({where:{id:userId}})
    if(!user){
        throw new AppError("User not found!",404);
    }
    return user.status;
}

export const patchStatusService = async(userId:number,updatedStatus:string)=>{
    const user = await prisma.user.findUnique({where:{id:userId},select:{status:true,id:true}})
    if(!user){
        throw new AppError("User not found!",404);
    }
    const updatedUser = await prisma.user.update(
        {
            where:{
                id:userId
            },
            data:{
                status:updatedStatus
            }
        });
    return true;
}