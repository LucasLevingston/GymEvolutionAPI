"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingWeekController = deleteTrainingWeekController;
const get_training_week_by_id_1 = require("../../services/training-week/get-training-week-by-id");
const delete_training_week_1 = require("../../services/training-week/delete-training-week");
const is_trainer_assigned_to_student_1 = require("../../services/training-week/is-trainer-assigned-to-student");
async function deleteTrainingWeekController(request, reply) {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const trainingWeek = await (0, get_training_week_by_id_1.getTrainingWeekById)(id);
    // Only trainers and admins can delete training weeks
    if (role !== 'TRAINER' && role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a trainer is trying to delete a student's training week
    if (role === 'TRAINER' && trainingWeek.userId !== userId) {
        // Check if the trainer is assigned to this student
        const isAssigned = await (0, is_trainer_assigned_to_student_1.isTrainerAssignedToStudent)(userId, trainingWeek.userId);
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    await (0, delete_training_week_1.deleteTrainingWeek)(id);
    return reply.send({ message: 'Training week deleted successfully' });
}
