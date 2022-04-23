import { Router } from "express";
import { createUserHandler, verifyUserHandler } from "../controller/user.controller";
import { validateResource } from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/create', validateResource(createUserSchema),  createUserHandler);

router.post('/verifyUser/:id/:verificationCode', validateResource(verifyUserSchema) ,verifyUserHandler);

export default router;