"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiet = createDiet;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function createDiet({ weekNumber, totalCalories, totalProtein, totalCarbohydrates, totalFat, userId, meals = [], }) {
    const existingDiet = await prisma_1.prisma.diet.findFirst({
        where: {
            userId,
            weekNumber,
        },
    });
    if (existingDiet) {
        throw new client_error_1.ClientError('A diet with this week number already exists');
    }
    const diet = await prisma_1.prisma.diet.create({
        data: {
            weekNumber,
            totalCalories,
            totalProtein,
            totalCarbohydrates,
            totalFat,
            userId,
            meals: {
                create: meals.map((meal) => ({
                    name: meal.name,
                    day: meal.day,
                    hour: meal.hour,
                    calories: meal.calories,
                    protein: meal.protein,
                    carbohydrates: meal.carbohydrates,
                    fat: meal.fat,
                    mealType: meal.mealType,
                    servingSize: meal.servingSize,
                    isCompleted: false,
                    mealItems: meal.mealItems
                        ? {
                            create: meal.mealItems.map((item) => ({
                                name: item.name,
                                quantity: item.quantity,
                                calories: item.calories,
                                protein: item.protein,
                                carbohydrates: item.carbohydrates,
                                fat: item.fat,
                            })),
                        }
                        : undefined,
                })),
            },
        },
        include: {
            meals: {
                include: {
                    mealItems: true,
                },
            },
        },
    });
    await (0, create_history_entry_1.createHistoryEntry)(userId, `Diet for week ${weekNumber} created with ${meals.length} meals`);
    return diet;
}
