import type { Request,Response,NextFunction } from "express";
import {AppError} from "../../errors/AppError.js";
import {getStatusService} from "./statusService.js";

export const getStatus = async(
    req: Request,
    res: Response,
    next: NextFunction)=>{
        try{
            const status = await getStatusService(req.userId!);
            res.status(200).json({status:status});
        }
        catch(err){
            if(err instanceof AppError){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
            }
            next(err);
        }

    }
export const postStatus = async(
    req: Request,
    res: Response,
    next: NextFunction)=>{
        
    }