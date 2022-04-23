import { Router } from "express";
import user from './user.routes';
import auth from './auth.routes';

const router = Router();

router.get('/', (_, res) => {
    res.send("Hello");
});

router.use('/user', user);
router.use('/auth', auth);

export default router;