import {Request,Response,NextFunction} from "express";
import {ZodType} from "zod";

export const validate = (schema:ZodType)=>{
    return (req:Request, res:Response,next:NextFunction) => {
        const result = schema.safeParse(req.body);
        console.log(result.error?.flatten());
        if(!result.success){
            return res.status(422).json({
                message:"Validation failed",
                errors:result.error.flatten()
            });
        }
        req.body = result.data;
        next();
    };
};