"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingDay = updateTrainingDay;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateTrainingDay(id, data) {
    const trainingDay = await prisma_1.prisma.trainingDay.findUnique({
        where: { id },
        include: {
            trainingWeek: true,
        },
    });
    if (!trainingDay) {
        throw new client_error_1.ClientError('Training day not found');
    }
    // Update the training day
    const updatedTrainingDay = await prisma_1.prisma.trainingDay.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(trainingDay.trainingWeek.userId, `Training day for ${trainingDay.group} updated`);
    return updatedTrainingDay;
}
