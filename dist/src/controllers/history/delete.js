"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHistoryController = deleteHistoryController;
const prisma_1 = require("lib/prisma");
async function deleteHistoryController(request, reply) {
    try {
        await prisma_1.prisma.history.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'History entry deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
