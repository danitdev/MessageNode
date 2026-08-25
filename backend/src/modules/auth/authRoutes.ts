import {Router} from "express";
import {validate} from "../../middleware/validate.js";
import {RegisterUserInput,registerUserSchema} from "./authSchema.js";
import {signUp} from "./authController.js";

const router = Router();

router.put("/signup",validate(registerUserSchema),signUp);

export default router;