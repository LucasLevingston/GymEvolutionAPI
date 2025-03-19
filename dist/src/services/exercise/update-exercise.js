"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExercise = updateExercise;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateExercise(id, data) {
    const exercise = await prisma_1.prisma.exercise.findUnique({
        where: { id },
        include: {
            trainingDay: {
                include: {
                    trainingWeek: true,
                },
            },
        },
    });
    if (!exercise || !exercise.trainingDay) {
        throw new client_error_1.ClientError('Exercise not found');
    }
    // Update the exercise
    const updatedExercise = await prisma_1.prisma.exercise.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(exercise.trainingDay.trainingWeek.userId, `Exercise ${exercise.name} updated`);
    return updatedExercise;
}
