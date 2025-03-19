"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingDay = createTrainingDay;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
async function createTrainingDay({ group, dayOfWeek, comments, trainingWeekId, studentId, }) {
    // Create the training day
    const trainingDay = await prisma_1.prisma.trainingDay.create({
        data: {
            group,
            dayOfWeek,
            comments,
            trainingWeekId,
        },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Training day for ${group} on ${dayOfWeek} created`);
    return trainingDay;
}
