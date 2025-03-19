"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingWeek = updateTrainingWeek;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateTrainingWeek(id, data) {
    const trainingWeek = await prisma_1.prisma.trainingWeek.findUnique({
        where: { id },
    });
    if (!trainingWeek) {
        throw new client_error_1.ClientError('Training week not found');
    }
    // If setting this week as current, unset any other current weeks
    if (data.current) {
        await prisma_1.prisma.trainingWeek.updateMany({
            where: {
                userId: trainingWeek.userId,
                current: true,
            },
            data: {
                current: false,
            },
        });
    }
    // Update the training week
    const updatedTrainingWeek = await prisma_1.prisma.trainingWeek.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(trainingWeek.userId, `Training week ${trainingWeek.weekNumber} updated`);
    return updatedTrainingWeek;
}
