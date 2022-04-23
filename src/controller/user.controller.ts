import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import { sendEmail } from '../utils/mailer';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res:Response) {
    const body = req.body;
    console.log(body);
    
    try {
        const user = await createUser(body);

        await sendEmail({
            from: 'test@mailer.com',
            to: user.email,
            subject: 'Verify your account',
            text: `verification code: ${user.verificationCode}`
        });
        return res.send("user created !!!");
    } catch (error: any) {
        if(error.code === 11000){
            return res.status(401).send("User with this email already exists");
        }
        return res.status(500).json(error);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput, {}, {}>, res:Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;   

    try {
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(400).json("Unable to verify user");
        }
        if(user.verified){
            return res.status(400).json("Unable to verify user");
        }
        if(user.verificationCode === verificationCode){
            user.verified = true;
            await user.save();
            res.send("User Verified !!!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}