"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
const get_user_by_id_1 = require("services/user/get-user-by-id");
async function loginService(email) {
    return await (0, get_user_by_id_1.getUserByIdService)(email);
}
