"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNutritionists = getAllNutritionists;
const prisma_1 = require("../../lib/prisma");
async function getAllNutritionists() {
    return prisma_1.prisma.user.findMany({
        where: {
            role: 'NUTRITIONIST',
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
