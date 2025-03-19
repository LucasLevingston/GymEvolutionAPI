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
    if (!exercise || !exercise.trainingDay) {
        throw new client_error_1.ClientError('Exercise not found');
    }
    // Mark the exercise as done
    const updatedExercise = await prisma_1.prisma.exercise.update({
        where: { id },
        data: {
            done: true,
        },
    });
    // Check if all exercises in the training day are done
    const allExercises = await prisma_1.prisma.exercise.findMany({
        where: {
            trainingDayId: exercise.trainingDayId,
        },
    });
    const allDone = allExercises.every(ex => ex.done);
    if (allDone) {
        // Mark the training day as done
        await prisma_1.prisma.trainingDay.update({
            where: { id: exercise.trainingDayId },
            data: {
                done: true,
            },
        });
        // Check if all training days in the week are done
        const allTrainingDays = await prisma_1.prisma.trainingDay.findMany({
            where: {
                trainingWeekId: exercise.trainingDay.trainingWeekId,
            },
        });
        const allDaysDone = allTrainingDays.every(day => day.done);
        if (allDaysDone) {
            // Mark the training week as done
            await prisma_1.prisma.trainingWeek.update({
                where: { id: exercise.trainingDay.trainingWeekId },
                data: {
                    done: true,
                },
            });
        }
    }
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(exercise.trainingDay.trainingWeek.userId, `Exercise ${exercise.name} marked as done`);
    return updatedExercise;
}
