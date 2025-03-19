"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMealItemController = deleteMealItemController;
const prisma_1 = require("lib/prisma");
async function deleteMealItemController(request, reply) {
    try {
        await prisma_1.prisma.mealItems.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'Meal item deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
