"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markExerciseAsDone = markExerciseAsDone;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function markExerciseAsDone(id) {
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
    if (!exercise ||
        !exercise.trainingDayId ||
        !exercise.trainingDay?.trainingWeekId ||
        !exercise.trainingDay?.trainingWeek?.userId) {
        throw new client_error_1.ClientError('Exercise not found');
    }
    // Mark the exercise as isCompleted
    const updatedExercise = await prisma_1.prisma.exercise.update({
        where: { id },
        data: {
            isCompleted: true,
        },
    });
    // Check if all exercises in the training day are isCompleted
    const allExercises = await prisma_1.prisma.exercise.findMany({
        where: {
            trainingDayId: exercise.trainingDayId,
        },
    });
    const allDone = allExercises.every((ex) => ex.isCompleted);
    if (allDone) {
        // Mark the training day as isCompleted
        await prisma_1.prisma.trainingDay.update({
            where: { id: exercise.trainingDayId },
            data: {
                isCompleted: true,
            },
        });
        // Check if all training days in the week are isCompleted
        const allTrainingDays = await prisma_1.prisma.trainingDay.findMany({
            where: {
                trainingWeekId: exercise.trainingDay.trainingWeekId,
            },
        });
        const allDaysDone = allTrainingDays.every((day) => day.isCompleted);
        if (allDaysDone) {
            // Mark the training week as isCompleted
            await prisma_1.prisma.trainingWeek.update({
                where: { id: exercise.trainingDay.trainingWeekId },
                data: {
                    isCompleted: true,
                },
            });
        }
    }
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(exercise.trainingDay.trainingWeek.userId, `Exercise ${exercise.name} marked as isCompleted`);
    return updatedExercise;
}
