"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeal = createMeal;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
async function createMeal(data, studentId) {
    // Create the meal
    const meal = await prisma_1.prisma.meal.create({
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Meal ${data.name} added to diet`);
    return meal;
}
