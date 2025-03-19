"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTrainingDayAsDone = markTrainingDayAsDone;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function markTrainingDayAsDone(id) {
    const trainingDay = await prisma_1.prisma.trainingDay.findUnique({
        where: { id },
        include: {
            trainingWeek: true,
        },
    });
    if (!trainingDay) {
        throw new client_error_1.ClientError('Training day not found');
    }
    // Mark the training day as done
    const updatedTrainingDay = await prisma_1.prisma.trainingDay.update({
        where: { id },
        data: {
            done: true,
        },
    });
    // Check if all training days in the week are done
    const allTrainingDays = await prisma_1.prisma.trainingDay.findMany({
        where: {
            trainingWeekId: trainingDay.trainingWeekId,
        },
    });
    const allDaysDone = allTrainingDays.every(day => day.done);
    if (allDaysDone) {
        // Mark the training week as done
        await prisma_1.prisma.trainingWeek.update({
            where: { id: trainingDay.trainingWeekId },
            data: {
                done: true,
            },
        });
    }
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(trainingDay.trainingWeek.userId, `Training day for ${trainingDay.group} marked as done`);
    return updatedTrainingDay;
}
