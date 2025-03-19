"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealItemController = updateMealItemController;
const prisma_1 = require("lib/prisma");
async function updateMealItemController(request, reply) {
    try {
        const mealItem = await prisma_1.prisma.mealItems.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(mealItem);
    }
    catch (error) {
        throw error;
    }
}
