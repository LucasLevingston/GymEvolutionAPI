"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightHistory = getWeightHistory;
const prisma_1 = require("../../lib/prisma");
async function getWeightHistory(userId) {
    return prisma_1.prisma.weight.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: 'desc',
        },
    });
}
