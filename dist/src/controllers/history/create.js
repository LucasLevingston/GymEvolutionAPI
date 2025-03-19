"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryController = createHistoryController;
const prisma_1 = require("lib/prisma");
async function createHistoryController(request, reply) {
    try {
        const history = await prisma_1.prisma.history.create({
            data: request.body,
        });
        return reply.code(201).send(history);
    }
    catch (error) {
        throw error;
    }
}
