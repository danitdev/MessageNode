import { AppError } from "../../errors/AppError.js";
import {prisma} from "../../lib/prisma.js";


export const getStatusService = async(userId:number)=>{
    const user = await prisma.user.findUnique({where:{id:userId}})
    if(!user){
        throw new AppError("User not found!",404);
    }
    return user.status;
}
