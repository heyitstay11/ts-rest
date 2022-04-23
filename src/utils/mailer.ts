import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';

const smtp = config.get<{
    user: string,
    pass: string,
    host:string,
    port: number,
    secure: boolean
}>('smtp');

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: {
        user: smtp.user,
        pass: smtp.pass
    }
})

export async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if(err){
            return console.log(err);
        }
        console.log('Preview Url', nodemailer.getTestMessageUrl(info));
    })
}