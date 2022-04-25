import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = (req.headers['authorization'] || '').replace(/^Bearer\s/, "");

        if(!accessToken){
            return next();
        }

        const decoded = verifyJwt(accessToken, 'accessTokenPrivateKey');

        if(decoded){
            res.locals.user = decoded;
        }
        
        return next();
    } catch (error) {
        console.log(error);
        return next();
    }
}

export default deserializeUser;