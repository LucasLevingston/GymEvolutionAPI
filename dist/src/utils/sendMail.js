"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const env_1 = require("../env");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'lucaslevingston94@gmail.com',
        pass: env_1.env.NODEMAILER_PASS,
    },
});
async function sendMail(to, resetUrl) {
    return await transporter.sendMail({
        to,
        subject: 'Gym Evolution: Password Recover',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });
}
