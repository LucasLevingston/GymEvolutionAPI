"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = deleteUserController;
const delete_user_1 = require("../../services/user/delete-user");
async function deleteUserController(request, reply) {
    const { id } = request.params;
    const { role } = request.user;
    if (role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    await (0, delete_user_1.deleteUser)(id);
    return reply.send({ message: 'User deleted successfully' });
}
