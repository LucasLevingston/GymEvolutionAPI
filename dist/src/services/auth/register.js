"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserService = registerUserService;
const prisma_1 = require("lib/prisma");
async function registerUserService(data) {
    return await prisma_1.prisma.user.create({
        data,
    });
}
