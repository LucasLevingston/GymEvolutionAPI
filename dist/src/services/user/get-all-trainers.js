"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrainers = getAllTrainers;
const prisma_1 = require("../../lib/prisma");
async function getAllTrainers() {
    return prisma_1.prisma.user.findMany({
        where: {
            role: 'TRAINER',
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
