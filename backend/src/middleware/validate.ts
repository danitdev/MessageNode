import {Request,Response,NextFunction} from "express";
import {ZodType} from "zod";
import {AppError} from "../errors/AppError.js"

export const validate = (schema:ZodType)=>{
    return (req:Request, res:Response,next:NextFunction) => {
        const result = schema.safeParse(req.body);
        console.log(result.error?.flatten());
        if(!result.success){
            const error = new AppError(
                "Validation failed, entered data is incorrect.",
                422);
            throw error;
            // return res.status(422).json({
            //     message:"Validation failed",
            //     errors:result.error.flatten()
            // });
        }
        req.body = result.data;
        next();
    };
};