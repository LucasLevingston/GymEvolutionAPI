"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingWeekByIdController = getTrainingWeekByIdController;
const get_training_week_by_id_1 = require("../../services/training-week/get-training-week-by-id");
const is_professional_assigned_to_student_1 = require("../../services/training-week/is-professional-assigned-to-student");
async function getTrainingWeekByIdController(request, reply) {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const trainingWeek = await (0, get_training_week_by_id_1.getTrainingWeekById)(id);
    // Check if the user has access to this training week
    if (trainingWeek.userId !== userId && role === 'STUDENT') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a trainer or nutritionist is trying to access a student's training week
    if ((role === 'TRAINER' || role === 'NUTRITIONIST') && trainingWeek.userId !== userId) {
        // Check if the professional is assigned to this student
        const isAssigned = await (0, is_professional_assigned_to_student_1.isProfessionalAssignedToStudent)(userId, trainingWeek.userId, role);
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    return reply.send(trainingWeek);
}
