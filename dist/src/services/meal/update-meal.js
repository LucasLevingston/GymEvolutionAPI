"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeal = updateMeal;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateMeal(id, data) {
    const meal = await prisma_1.prisma.meal.findUnique({
        where: { id },
        include: {
            Diet: true,
        },
    });
    if (!meal || !meal.Diet) {
        throw new client_error_1.ClientError('Meal not found');
    }
    // Update the meal
    const updatedMeal = await prisma_1.prisma.meal.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(meal.Diet.userId, `Meal ${meal.name} updated`);
    return updatedMeal;
}
