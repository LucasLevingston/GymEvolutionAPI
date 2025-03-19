"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrainingWeeksController = getAllTrainingWeeksController;
const get_all_training_weeks_1 = require("../../services/training-week/get-all-training-weeks");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function getAllTrainingWeeksController(request, reply) {
    const { id: userId, role } = request.user;
    const { studentId } = request.query;
    // Determine the target user ID
    let targetUserId = userId;
    // If a trainer or nutritionist is viewing a student's training weeks
    if ((role === 'TRAINER' || role === 'NUTRITIONIST') && studentId) {
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
            .send({ message: 'Students can only view their own training weeks' });
    }
    const trainingWeeks = await (0, get_all_training_weeks_1.getAllTrainingWeeks)(targetUserId);
    return reply.send(trainingWeeks);
}
