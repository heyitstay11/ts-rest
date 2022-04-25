import { Router } from "express";
import { createSessionHandler, refreshAccessTokenHandler } from "../controller/auth.controller";
import { validateResource } from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = Router();

router.post('/session', validateResource(createSessionSchema), createSessionHandler);

router.post('/session/refresh', refreshAccessTokenHandler);

export default router;