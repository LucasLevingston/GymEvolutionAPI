"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerie = createSerie;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
async function createSerie({ seriesIndex, repetitions, weight, exerciseId, studentId, }) {
    // Check if a series with this index already exists
    const existingSerie = await prisma_1.prisma.serie.findFirst({
        where: {
            exerciseId,
            seriesIndex,
        },
    });
    let serie;
    if (existingSerie) {
        // Update existing serie
        serie = await prisma_1.prisma.serie.update({
            where: { id: existingSerie.id },
            data: {
                repetitions,
                weight,
            },
        });
    }
    else {
        // Create new serie
        serie = await prisma_1.prisma.serie.create({
            data: {
                seriesIndex,
                repetitions,
                weight,
                exerciseId,
            },
        });
    }
    // Get the exercise name for the history entry
    const exercise = await prisma_1.prisma.exercise.findUnique({
        where: { id: exerciseId },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Series ${seriesIndex + 1} recorded for exercise ${exercise?.name}`);
    return serie;
}
