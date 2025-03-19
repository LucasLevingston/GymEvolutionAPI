"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMealItem = createMealItem;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const update_meal_totals_1 = require("./update-meal-totals");
async function createMealItem(data, studentId) {
    // Create the meal item
    const mealItem = await prisma_1.prisma.mealItems.create({
        data,
    });
    // Update meal totals
    await (0, update_meal_totals_1.updateMealTotals)(data.mealId);
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Meal item ${data.name} added to meal`);
    return mealItem;
}
