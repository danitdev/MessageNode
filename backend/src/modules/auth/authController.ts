import type {Request,Response,NextFunction} from "express";
import {} from "./authSevice.js";
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
        }catch(err){
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
            }
            next(err);
        }
};