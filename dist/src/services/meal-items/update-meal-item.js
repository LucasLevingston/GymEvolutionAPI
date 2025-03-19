"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealItem = updateMealItem;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const update_meal_totals_1 = require("./update-meal-totals");
const client_error_1 = require("../../errors/client-error");
async function updateMealItem(id, data) {
    const mealItem = await prisma_1.prisma.mealItems.findUnique({
        where: { id },
        include: {
            Meal: {
                include: {
                    Diet: true,
                },
            },
        },
    });
    if (!mealItem || !mealItem.Meal || !mealItem.Meal.Diet) {
        throw new client_error_1.ClientError('Meal item not found');
    }
    // Update the meal item
    const updatedMealItem = await prisma_1.prisma.mealItems.update({
        where: { id },
        data,
    });
    // Update meal totals
    await (0, update_meal_totals_1.updateMealTotals)(mealItem.mealId);
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(mealItem.Meal.Diet.userId, `Meal item ${mealItem.name} updated`);
    return updatedMealItem;
}
