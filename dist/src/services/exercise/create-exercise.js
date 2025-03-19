"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExercise = createExercise;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
async function createExercise({ name, variation, repetitions, sets, trainingDayId, studentId, }) {
    // Create the exercise
    const exercise = await prisma_1.prisma.exercise.create({
        data: {
            name,
            variation,
            repetitions,
            sets,
            trainingDayId,
        },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Exercise ${name} added to training day`);
    return exercise;
}
