"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignNutritionist = assignNutritionist;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function assignNutritionist(nutritionistId, studentId) {
    // Check if nutritionist exists and is a nutritionist
    const nutritionist = await prisma_1.prisma.user.findFirst({
        where: {
            id: nutritionistId,
            role: 'NUTRITIONIST',
        },
    });
    if (!nutritionist) {
        throw new client_error_1.ClientError('Nutritionist not found');
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
            nutritionistId,
            studentId,
            status: 'ACTIVE',
        },
    });
    // Create history entry
    await (0, create_history_entry_1.createHistoryEntry)(studentId, `Nutritionist ${nutritionist.name} assigned to student ${student.name}`);
    return relationship;
}
