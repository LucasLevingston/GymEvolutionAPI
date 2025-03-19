"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecover = passwordRecover;
const get_by_email_1 = require("services/user/get-by-email");
const password_recover_1 = require("services/auth/password-recover");
const client_error_1 = require("errors/client-error");
const sendMail_1 = require("utils/sendMail");
const env_1 = require("../../env");
const jwt_1 = require("utils/jwt");
async function passwordRecover(request, reply) {
    try {
        const { FRONTEND_URL } = env_1.env;
        const { email } = request.body;
        const user = await (0, get_by_email_1.getUserByEmailService)(email);
        if (!user) {
            throw new client_error_1.ClientError('User not found');
        }
        const token = (0, jwt_1.generateToken)(user.id);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        const result = await (0, password_recover_1.passwordRecoverService)(email, token, expirationDate);
        if (!result)
            throw new client_error_1.ClientError('Error on generate token');
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
        const emailSentResult = await (0, sendMail_1.sendMail)(email, resetUrl);
        if (!emailSentResult)
            throw new client_error_1.ClientError('Error on send mail');
        reply.code(200).send({ message: 'Password reset email sent' });
    }
    catch (error) {
        throw error;
    }
}
