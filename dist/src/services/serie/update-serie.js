"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSerie = updateSerie;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateSerie(id, data) {
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
    if (!serie || !serie.exercise || !serie.exercise.trainingDay?.trainingWeek) {
        throw new client_error_1.ClientError('Serie not found');
    }
    // Update the serie
    const updatedSerie = await prisma_1.prisma.serie.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(serie.exercise.trainingDay.trainingWeek.userId, `Series ${serie.seriesIndex || 0 + 1} updated for exercise ${serie.exercise.name}`);
    return updatedSerie;
}
