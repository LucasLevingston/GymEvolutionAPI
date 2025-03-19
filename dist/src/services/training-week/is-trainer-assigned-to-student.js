"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTrainerAssignedToStudent = isTrainerAssignedToStudent;
const prisma_1 = require("../../lib/prisma");
async function isTrainerAssignedToStudent(trainerId, studentId) {
    const relationship = await prisma_1.prisma.relationship.findFirst({
        where: {
            trainerId,
            student2Id: studentId,
            status: 'ACTIVE',
        },
    });
    return !!relationship;
}
