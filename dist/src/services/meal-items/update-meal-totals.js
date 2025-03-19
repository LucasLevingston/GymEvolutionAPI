"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealTotals = updateMealTotals;
const prisma_1 = require("../../lib/prisma");
async function updateMealTotals(mealId) {
    const mealItems = await prisma_1.prisma.mealItems.findMany({
        where: {
            mealId,
        },
    });
    const totalCalories = mealItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = mealItems.reduce((sum, item) => sum + (item.protein || 0), 0);
    const totalCarbs = mealItems.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
    const totalFat = mealItems.reduce((sum, item) => sum + (item.fat || 0), 0);
    await prisma_1.prisma.meal.update({
        where: { id: mealId },
        data: {
            calories: totalCalories,
            protein: totalProtein,
            carbohydrates: totalCarbs,
            fat: totalFat,
        },
    });
}
