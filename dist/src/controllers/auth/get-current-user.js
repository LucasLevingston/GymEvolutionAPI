"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = getCurrentUserController;
const get_current_user_1 = require("../../services/auth/get-current-user");
async function getCurrentUserController(request, reply) {
    const { id: userId } = request.user;
    const user = await (0, get_current_user_1.getCurrentUser)(userId);
    return reply.send(user);
}
