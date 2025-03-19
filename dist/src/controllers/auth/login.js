"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
const client_error_1 = require("errors/client-error");
const jwt_1 = require("utils/jwt");
const get_by_email_1 = require("services/user/get-by-email");
async function loginController(request) {
    try {
        const { email, password } = request.body;
        const user = await (0, get_by_email_1.getUserByEmailService)(email);
        if (!user) {
            throw new client_error_1.ClientError('User not found');
        }
        const isPasswordCorrect = await (0, jwt_1.comparePassword)(password, user.password);
        if (!isPasswordCorrect) {
            throw new client_error_1.ClientError('Invalid password');
        }
        const token = (0, jwt_1.generateToken)(user.id);
        return {
            user,
            token,
        };
    }
    catch (error) {
        throw error;
    }
}
