"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
const register_1 = require("../../services/auth/register");
const get_by_email_1 = require("services/user/get-by-email");
const client_error_1 = require("errors/client-error");
const jwt_1 = require("utils/jwt");
const create_history_entry_1 = require("services/history/create-history-entry");
async function registerController(request) {
    const { email, password } = request.body;
    try {
        const verifyIfUserExists = await (0, get_by_email_1.getUserByEmailService)(email);
        if (verifyIfUserExists) {
            throw new client_error_1.ClientError('User already exists');
        }
        const hashedPassword = await (0, jwt_1.hashPassword)(password);
        const user = await (0, register_1.registerUserService)({
            ...request.body,
            password: hashedPassword,
        });
        await (0, create_history_entry_1.createHistoryEntry)(user.id, 'User registered');
        const token = (0, jwt_1.generateToken)(user.id);
        return { user, token };
    }
    catch (error) {
        throw error;
    }
}
