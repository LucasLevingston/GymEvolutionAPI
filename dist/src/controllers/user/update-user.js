"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = updateUserController;
const update_user_1 = require("../../services/user/update-user");
const client_error_1 = require("errors/client-error");
const add_1 = require("services/history/add");
async function updateUserController(request) {
    try {
        const { id } = request.params;
        const { id: userId, role } = request.user;
        const updateData = request.body;
        if (id !== userId && role !== 'ADMIN') {
            throw new client_error_1.ClientError('Forbidden');
        }
        const history = await (0, add_1.addToHistory)(updateData);
        if (!history)
            throw new client_error_1.ClientError('Error on add to history');
        const updatedUser = await (0, update_user_1.updateUser)(updateData);
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
}
