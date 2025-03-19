"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMealItemController = createMealItemController;
const prisma_1 = require("lib/prisma");
async function createMealItemController(request, reply) {
    try {
        const mealItem = await prisma_1.prisma.mealItems.create({
            data: request.body,
        });
        return reply.code(201).send(mealItem);
    }
    catch (error) {
        throw error;
    }
}
