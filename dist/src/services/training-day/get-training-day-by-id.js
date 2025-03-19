"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingDayById = getTrainingDayById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getTrainingDayById(id) {
    const trainingDay = await prisma_1.prisma.trainingDay.findUnique({
        where: { id },
        include: {
            exercises: {
                include: {
                    seriesResults: true,
                },
            },
        },
    });
    if (!trainingDay) {
        throw new client_error_1.ClientError('Training day not found');
    }
    return trainingDay;
}
