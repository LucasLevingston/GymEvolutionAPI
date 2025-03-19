"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTrainer = assignTrainer;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function assignTrainer(trainerId, studentId) {
    // Check if trainer exists and is a trainer
    const trainer = await prisma_1.prisma.user.findFirst({
        where: {
            id: trainerId,
            role: 'TRAINER',
        },
    });
    if (!trainer) {
        throw new client_error_1.ClientError('Trainer not found');
    }
    // Check if student exists
    const student = await prisma_1.prisma.user.findFirst({
        where: {
            id: studentId,
            role: 'STUDENT',
        },
    });
    if (!student) {
        throw new client_error_1.ClientError('Student not found');
    }
    // Create relationship
    const relationship = await prisma_1.prisma.relationship.create({
        data: {
            trainerId,
            student2Id: studentId,
            status: 'ACTIVE',
        },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Trainer ${trainer.name} assigned to student ${student.name}`);
    return relationship;
}
