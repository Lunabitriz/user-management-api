import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    private generateRandomCode(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async sendPasswordResetEmail(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME || 'Sistema'} <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Redefinição de senha - User Management',
            html: `
                <h1>Olá, Dev!</h1>
                <p>Seu código de validação é:</p>
                <h2>${code}</h2>
                <p>Use este código para redefinir sua senha.</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async generateAndSendCode(email: string): Promise<string> {
        const code = this.generateRandomCode();
        await this.sendPasswordResetEmail(email, code);
        return code;
    }
}
