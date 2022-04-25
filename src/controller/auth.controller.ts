import { Request, Response } from "express";
import { get } from "lodash";
import SessionModel from "../model/session.model";
import UserModel from "../model/user.model";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../service/auth.service";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findOne({ email : email});
        if(!user){
            return res.status(400).json("No User with this email is registered");
        }
        if(!user.verified){
            return res.status(400).json("Verify your email first");
        }

        const isValid = await user.validatePassword(password);
        
        if(!isValid){
            return res.status(400).json("Incorrect password ");
        }

        const accessToken = signAccessToken(user);

        const refreshToken = await signRefreshToken({ userId: user._id });

        return res.json({ accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error); 
    }
} 

export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken = get(req, 'headers.x-refresh');

    const decoded = verifyJwt<{session: string}>(refreshToken, 'refreshTokenPrivateKey', )
    
    if(!decoded){
        return res.status(401).json({ msg: 'No Refresh Token provided'})
    }

    try {
        const session = await SessionModel.findById(decoded.session);
        
        if(!session || !session.valid){
            return res.status(401).json({ msg: 'No Refresh Token provided or session expired'})
        }

        const user = await UserModel.findById(session.user);

        if(!user){
            return res.status(401).json({ msg: 'No Refresh Token provided or session expired'});
        }

        const accessToken = signAccessToken(user);

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error); 
    }
}