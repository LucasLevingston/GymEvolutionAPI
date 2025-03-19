"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrainingWeeks = getAllTrainingWeeks;
const prisma_1 = require("../../lib/prisma");
async function getAllTrainingWeeks(userId) {
    return prisma_1.prisma.trainingWeek.findMany({
        where: {
            userId,
        },
        orderBy: {
            weekNumber: 'desc',
        },
        include: {
            trainingDays: true,
        },
    });
}
