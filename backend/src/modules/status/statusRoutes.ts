import {Router} from "express";
import {getStatus,patchStatus} from "./statusController.js";
import {isAuth} from "../../middleware/isAuth.js";
const statusRouter = Router();

statusRouter.get("/status",isAuth,getStatus);
statusRouter.patch("/status",isAuth,patchStatus);


export default statusRouter;
