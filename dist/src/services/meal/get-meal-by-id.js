"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealById = getMealById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getMealById(id) {
    const meal = await prisma_1.prisma.meal.findUnique({
        where: { id },
        include: {
            mealItems: true,
        },
    });
    if (!meal) {
        throw new client_error_1.ClientError('Meal not found');
    }
    return meal;
}
