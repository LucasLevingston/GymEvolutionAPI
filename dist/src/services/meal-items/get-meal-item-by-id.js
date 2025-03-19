"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealItemById = getMealItemById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getMealItemById(id) {
    const mealItem = await prisma_1.prisma.mealItems.findUnique({
        where: { id },
    });
    if (!mealItem) {
        throw new client_error_1.ClientError('Meal item not found');
    }
    return mealItem;
}
