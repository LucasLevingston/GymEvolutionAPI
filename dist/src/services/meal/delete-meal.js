"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeal = deleteMeal;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function deleteMeal(id) {
    const meal = await prisma_1.prisma.meal.findUnique({
        where: { id },
        include: {
            Diet: true,
        },
    });
    if (!meal || !meal.Diet) {
        throw new client_error_1.ClientError('Meal not found');
    }
    // Delete the meal
    await prisma_1.prisma.meal.delete({
        where: { id },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(meal.Diet.userId, `Meal ${meal.name} deleted`);
    return true;
}
