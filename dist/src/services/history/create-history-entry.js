"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryEntry = createHistoryEntry;
const prisma_1 = require("../../lib/prisma");
async function createHistoryEntry(userId, event) {
    return prisma_1.prisma.history.create({
        data: {
            event,
            date: new Date().toISOString(),
            userId,
        },
    });
}
