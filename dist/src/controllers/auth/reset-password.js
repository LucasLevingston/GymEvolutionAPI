"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = resetPasswordController;
const client_error_1 = require("errors/client-error");
const reset_password_1 = require("services/auth/reset-password");
const create_history_entry_1 = require("services/history/create-history-entry");
const get_user_by_token_1 = require("services/user/get-user-by-token");
const jwt_1 = require("utils/jwt");
async function resetPasswordController(request, reply) {
    try {
        const { password, token } = request.body;
        const user = await (0, get_user_by_token_1.getUserByToken)(token);
        if (!user) {
            throw new client_error_1.ClientError('User not exists');
        }
        const hashedPassword = await (0, jwt_1.hashPassword)(password);
        await (0, reset_password_1.resetPasswordService)(user.id, hashedPassword);
        await (0, create_history_entry_1.createHistoryEntry)(user.id, 'Password reset');
        reply.code(200).send({ message: 'Password reset successful' });
    }
    catch (error) {
        throw error;
    }
}
