"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingWeekById = getTrainingWeekById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getTrainingWeekById(id) {
    const trainingWeek = await prisma_1.prisma.trainingWeek.findUnique({
        where: { id },
        include: {
            trainingDays: {
                include: {
                    exercises: {
                        include: {
                            seriesResults: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!trainingWeek) {
        throw new client_error_1.ClientError('Training week not found');
    }
    return trainingWeek;
}
