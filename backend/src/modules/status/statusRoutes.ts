import {Router} from "express";
import {getStatus,patchStatus} from "./statusController.js";
import {isAuth} from "../../middleware/isAuth.js";
import {checkStatusSchema} from "./statusSchema.js";
import {validate} from "../../middleware/validate.js";
const statusRouter = Router();

statusRouter.get("/status",isAuth,getStatus);
statusRouter.patch("/status",isAuth,validate(checkStatusSchema),patchStatus);


export default statusRouter;
