"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiet = updateDiet;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function updateDiet(id, data) {
    const diet = await prisma_1.prisma.diet.findUnique({
        where: { id },
    });
    if (!diet) {
        throw new client_error_1.ClientError('Diet not found');
    }
    // Update the diet
    const updatedDiet = await prisma_1.prisma.diet.update({
        where: { id },
        data,
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(diet.userId, `Diet for week ${diet.weekNumber} updated`);
    return updatedDiet;
}
