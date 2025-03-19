"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersController = getAllUsersController;
const get_all_users_1 = require("../../services/user/get-all-users");
async function getAllUsersController(request, reply) {
    const { role } = request.user;
    if (role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    const users = await (0, get_all_users_1.getAllUsers)();
    return reply.send(users);
}
