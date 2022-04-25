import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import { validateResource } from "../middleware/validateResource";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";

const router = Router();

router.get("/me", requireUser ,getCurrentUserHandler);

router.post('/create', validateResource(createUserSchema),  createUserHandler);

router.post('/forgetPassword', validateResource(forgotPasswordSchema) , forgotPasswordHandler);

router.post('/resetPassword/:id/:passwordResetCode', validateResource(resetPasswordSchema) , resetPasswordHandler);

router.post('/verifyUser/:id/:verificationCode', validateResource(verifyUserSchema) , verifyUserHandler);

export default router;