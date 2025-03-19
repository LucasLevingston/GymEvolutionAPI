"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailService = getUserByEmailService;
const prisma_1 = require("lib/prisma");
async function getUserByEmailService(email) {
    return await prisma_1.prisma.user.findUnique({ where: { email } });
}
