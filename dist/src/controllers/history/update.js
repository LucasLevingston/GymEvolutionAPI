"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHistoryController = updateHistoryController;
const prisma_1 = require("lib/prisma");
async function updateHistoryController(request, reply) {
    try {
        const history = await prisma_1.prisma.history.update({
            where: { id: request.params.id },
            data: request.body,
        });
        return reply.send(history);
    }
    catch (error) {
        throw error;
    }
}
