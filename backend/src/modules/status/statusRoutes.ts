import {Router} from "express";
import {getStatus,postStatus} from "./statusController.js";

const statusRouter = Router();

statusRouter.get("/status",getStatus);
statusRouter.post("/status",postStatus);


export default statusRouter;
