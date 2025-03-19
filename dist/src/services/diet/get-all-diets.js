"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDiets = getAllDiets;
const prisma_1 = require("../../lib/prisma");
async function getAllDiets(userId) {
    return prisma_1.prisma.diet.findMany({
        where: {
            userId,
        },
        orderBy: {
            weekNumber: 'desc',
        },
        include: {
            meals: true,
        },
    });
}
