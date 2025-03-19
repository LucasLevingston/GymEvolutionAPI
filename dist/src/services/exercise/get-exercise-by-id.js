"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseById = getExerciseById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getExerciseById(id) {
    const exercise = await prisma_1.prisma.exercise.findUnique({
        where: { id },
        include: {
            seriesResults: true,
        },
    });
    if (!exercise) {
        throw new client_error_1.ClientError('Exercise not found');
    }
    return exercise;
}
