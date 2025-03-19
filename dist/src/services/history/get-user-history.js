"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHistory = getUserHistory;
const prisma_1 = require("../../lib/prisma");
async function getUserHistory(userId) {
    return prisma_1.prisma.history.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: 'desc',
        },
    });
}
