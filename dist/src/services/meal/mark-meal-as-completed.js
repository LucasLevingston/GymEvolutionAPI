"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMealAsCompleted = markMealAsCompleted;
const prisma_1 = require("../../lib/prisma");
async function markMealAsCompleted(id) {
    return await prisma_1.prisma.meal.update({
        where: { id },
        data: {
            isCompleted: true,
        },
        include: {
            Diet: true,
        },
    });
}
