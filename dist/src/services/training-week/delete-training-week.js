"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingWeek = deleteTrainingWeek;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function deleteTrainingWeek(id) {
    const trainingWeek = await prisma_1.prisma.trainingWeek.findUnique({
        where: { id },
    });
    if (!trainingWeek) {
        throw new client_error_1.ClientError('Training week not found');
    }
    // Delete the training week
    await prisma_1.prisma.trainingWeek.delete({
        where: { id },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(trainingWeek.userId, `Training week ${trainingWeek.weekNumber} deleted`);
    return true;
}
