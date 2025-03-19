"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
const prisma_1 = require("../../lib/prisma");
async function getAllUsers() {
    return prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
}
