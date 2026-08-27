import type {Request,Response,NextFunction} from "express";
import {registerUserService,loginUserService} from "./authSevice.js";
import {} from "./authSchema.js";
import {AppError} from "../../errors/AppError.js";


export const signUp = async (
    req:Request,
    res:Response,
    next:NextFunction) =>{
        try{
            const email = req.body.email;
            const name = req.body.name;
            const password = req.body.password;
            const user = await registerUserService(name,email,password);
            res.status(201).json({message:"User Created!",userId:user.id});
        }catch(err){
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
            }
            next(err);
        }
};

export const login = async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
        try{
            const email = req.body.email;
            const password = req.body.password;
            const {token,userId} = await loginUserService(email,password);
            res.status(200).json({token:token,userId:userId});
              
        }catch(err){
             
        }
};