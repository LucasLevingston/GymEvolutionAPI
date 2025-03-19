"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiet = deleteDiet;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function deleteDiet(id) {
    const diet = await prisma_1.prisma.diet.findUnique({
        where: { id },
    });
    if (!diet) {
        throw new client_error_1.ClientError('Diet not found');
    }
    // Delete the diet
    await prisma_1.prisma.diet.delete({
        where: { id },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(diet.userId, `Diet for week ${diet.weekNumber} deleted`);
    return true;
}
