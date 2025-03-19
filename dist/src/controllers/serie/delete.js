"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSerieController = deleteSerieController;
const prisma_1 = require("lib/prisma");
async function deleteSerieController(request, reply) {
    try {
        await prisma_1.prisma.serie.delete({
            where: { id: request.params.id },
        });
        return reply.send({ message: 'Serie deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
