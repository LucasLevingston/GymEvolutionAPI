"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecoverService = passwordRecoverService;
const prisma_1 = require("lib/prisma");
async function passwordRecoverService(email, token, expirationDate) {
    return await prisma_1.prisma.user.update({
        where: { email },
        data: {
            resetPasswordToken: token,
            resetPasswordExpires: expirationDate,
        },
    });
}
