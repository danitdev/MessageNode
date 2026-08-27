import type { Request,Response,NextFunction } from "express";
import {AppError} from "../../errors/AppError.js";
import {getStatusService,patchStatusService} from "./statusService.js";

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
export const patchStatus = async(
    req: Request,
    res: Response,
    next: NextFunction)=>{
        try{
            const updatedStatus = req.body.status;
            const isStatusUpdated = await patchStatusService(req.userId!,updatedStatus);
            if(!isStatusUpdated){
                throw new AppError("Something went wrong!",500);
            }
            res.status(200).json({Message:"User Updated!"});
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