import { Request, Response } from 'express';
import { omit } from 'lodash';
import { nanoid } from 'nanoid';
import UserModel, { privateFields } from '../model/user.model';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
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
        if(user.verificationCode !== verificationCode){
            return res.status(400).json("Unable to verify user");
        }
        user.verified = true;
        await user.save();
        return res.send("User Verified !!!");
    } catch (error) {
        return res.status(500).json(error);
    }
}


export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        
        if(!user){
            return res.status(400).json("No User with this email is registered");
        }
        if(!user.verified){
            return res.status(400).json("User is not verified, first verify user via email");
        }
        
        user.passwordResetCode = nanoid();
        await user.save();

        // send reset Code
        await sendEmail({
            from: 'test@mailer.com',
            to: user.email,
            subject: 'Reset your password',
            text: `Password Reset code: ${user.passwordResetCode}, id: ${user._id}`,
        });

        return res.json(user.passwordResetCode);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response){
    const { id, passwordResetCode} = req.params;
    const { password } = req.body;

    try {
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(400).json("No User with this email is registered");
        }
        if(!user.verified || user.passwordResetCode !== passwordResetCode ){
            return res.status(400).json("Unable to verify user for the process, try again with new reset code");
        }
        user.password = password;
        user.passwordResetCode = null;
        await user.save();

        return res.json("Successfully updated user password");
    } catch (error) {
        return res.status(500).json(error); 
    }

}

export async function getCurrentUserHandler(req: Request, res: Response ) {
    try {
        const { id } = res.locals.user;
        
        const user  = await UserModel.findById(id);
        
        return res.json(omit(user?.toJSON(), privateFields));
    } catch (error) {
        return res.status(500).json(error); 
    }
}