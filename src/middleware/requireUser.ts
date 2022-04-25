import { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if(!user){
        res.status(403).json({msg: 'Not Authorized'})
    }
    next();
}

export default requireUser;