"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDietById = getDietById;
const prisma_1 = require("../../lib/prisma");
const client_error_1 = require("../../errors/client-error");
async function getDietById(id) {
    const diet = await prisma_1.prisma.diet.findUnique({
        where: { id },
        include: {
            meals: {
                include: {
                    mealItems: true,
                },
            },
            User: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!diet) {
        throw new client_error_1.ClientError('Diet not found');
    }
    return diet;
}
