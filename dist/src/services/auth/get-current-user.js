"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getCurrentUser(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            sex: true,
            birthDate: true,
            phone: true,
            currentWeight: true,
            city: true,
            state: true,
        },
    });
    if (!user) {
        throw new client_error_1.ClientError('User not found');
    }
    return user;
}
