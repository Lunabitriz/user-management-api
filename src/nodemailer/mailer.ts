import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export function generateRandomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export async function sendResetEmail(to: string): Promise<{ code: string }> {
    const code = generateRandomCode();
    const transporter = createTransporter();

    const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject: "Redefinição de senha - Sistema de Usuários",
    html: `
        <h2>Redefinição de senha</h2>
        <p>Olá, seu código de validação é:</p>
        <h1>${code}</h1>
        <p>Use-o para redefinir sua senha.</p>
    `,
    };

    await transporter.sendMail(mailOptions);

    return { code };
}
