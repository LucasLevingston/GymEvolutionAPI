"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWeightRecordController = void 0;
const is_professional_assigned_to_student_1 = require("services/training-week/is-professional-assigned-to-student");
const add_weight_record_1 = require("services/weight/add-weight-record");
const addWeightRecordController = async (request, reply) => {
    const { id: userId, role } = request.user;
    const { weight, bf, date, studentId } = request.body;
    let targetUserId = userId;
    // If a nutritionist or trainer is adding weight for a student
    if ((role === 'NUTRITIONIST' || role === 'TRAINER') && studentId) {
        // Check if the professional is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, studentId, role);
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
        targetUserId = studentId;
    }
    else if (studentId && role === 'STUDENT') {
        return reply
            .status(403)
            .send({ message: 'Students can only add weight for themselves' });
    }
    const weightRecord = await (0, add_weight_record_1.addWeightRecord)({
        weight,
        bf: bf || '0',
        date: date || new Date().toISOString(),
        userId: targetUserId,
    });
    return reply.status(201).send(weightRecord);
};
exports.addWeightRecordController = addWeightRecordController;
