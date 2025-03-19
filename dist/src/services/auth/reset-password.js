"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = resetPasswordService;
const prisma_1 = require("lib/prisma");
async function resetPasswordService(id, newPassword) {
    return await prisma_1.prisma.user.update({
        where: { id },
        data: {
            password: newPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        },
    });
}
