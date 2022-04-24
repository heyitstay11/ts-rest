import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";
import { validateResource } from "../middleware/validateResource";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/create', validateResource(createUserSchema),  createUserHandler);

router.post('/forgetPassword', validateResource(forgotPasswordSchema) , forgotPasswordHandler);

router.post('/resetPassword/:id/:passwordResetCode', validateResource(resetPasswordSchema) , resetPasswordHandler);

router.post('/verifyUser/:id/:verificationCode', validateResource(verifyUserSchema) , verifyUserHandler);

export default router;