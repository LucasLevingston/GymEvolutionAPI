"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = deleteUser;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function deleteUser(id) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new client_error_1.ClientError('User not found');
    }
    await prisma_1.prisma.user.delete({
        where: { id },
    });
    return true;
}
