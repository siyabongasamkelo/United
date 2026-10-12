"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async ({ to, subject, html, text, }) => {
    try {
        const info = await transporter.sendMail({
            // IMPORTANT: Brevo requires the 'from' email to be VERIFIED in your dashboard
            from: `"Clinic App" <${process.env.EMAIL_SENDER}>`,
            to,
            subject,
            text,
            html,
        });
        return info;
    }
    catch (error) {
        console.error("BREVO ERROR:", error.message);
        throw new Error("Email could not be sent via Brevo");
    }
};
exports.sendEmail = sendEmail;
// export default sendEmail;
