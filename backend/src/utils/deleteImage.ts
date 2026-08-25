import {unlink} from "fs/promises";
import path from "path";
import rootDir from "./path.js";

export const deleteImage = async(filePath:string) =>{
    const fullPath = path.join(rootDir,filePath);
    await unlink(fullPath);
};