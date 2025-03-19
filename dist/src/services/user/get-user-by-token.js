"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByToken = void 0;
const prisma_1 = require("lib/prisma");
const getUserByToken = async (token) => {
    return await prisma_1.prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() },
        },
    });
};
exports.getUserByToken = getUserByToken;
