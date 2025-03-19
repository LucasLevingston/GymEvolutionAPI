"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdController = getUserByIdController;
const get_user_by_id_1 = require("../../services/user/get-user-by-id");
const client_error_1 = require("../../errors/client-error");
async function getUserByIdController(request) {
    try {
        const { id } = request.params;
        const { id: userId, role } = request.user;
        if (id !== userId && role === 'STUDENT') {
            throw new client_error_1.ClientError('Forbidden');
        }
        const userData = await (0, get_user_by_id_1.getUserByIdService)(id);
        if (!userData) {
            throw new client_error_1.ClientError('User not found');
        }
        return userData;
    }
    catch (error) {
        throw error;
    }
}
