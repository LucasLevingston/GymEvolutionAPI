"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingDay = deleteTrainingDay;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function deleteTrainingDay(id) {
    const trainingDay = await prisma_1.prisma.trainingDay.findUnique({
        where: { id },
        include: {
            trainingWeek: true,
        },
    });
    if (!trainingDay) {
        throw new client_error_1.ClientError('Training day not found');
    }
    // Delete the training day
    await prisma_1.prisma.trainingDay.delete({
        where: { id },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(trainingDay.trainingWeek.userId, `Training day for ${trainingDay.group} deleted`);
    return true;
}
