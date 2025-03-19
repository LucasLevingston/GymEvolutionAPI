"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSerie = deleteSerie;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function deleteSerie(id) {
    const serie = await prisma_1.prisma.serie.findUnique({
        where: { id },
        include: {
            exercise: {
                include: {
                    trainingDay: {
                        include: {
                            trainingWeek: true,
                        },
                    },
                },
            },
        },
    });
    if (!serie || !serie.exercise || !serie.exercise.trainingDay) {
        throw new client_error_1.ClientError('Serie not found');
    }
    // Delete the serie
    await prisma_1.prisma.serie.delete({
        where: { id },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(serie.exercise.trainingDay.trainingWeek.userId, `Series ${serie.seriesIndex + 1} deleted for exercise ${serie.exercise.name}`);
    return true;
}
