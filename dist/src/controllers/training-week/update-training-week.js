"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingWeekController = updateTrainingWeekController;
const get_training_week_by_id_1 = require("../../services/training-week/get-training-week-by-id");
const update_training_week_1 = require("../../services/training-week/update-training-week");
const is_trainer_assigned_to_student_1 = require("../../services/training-week/is-trainer-assigned-to-student");
async function updateTrainingWeekController(request, reply) {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const updateData = request.body;
    const trainingWeek = await (0, get_training_week_by_id_1.getTrainingWeekById)(id);
    // Check if the user has access to update this training week
    if (role === 'STUDENT' && trainingWeek.userId !== userId) {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    // If a trainer is trying to update a student's training week
    if (role === 'TRAINER' && trainingWeek.userId !== userId) {
        // Check if the trainer is assigned to this student
        const isAssigned = await (0, is_trainer_assigned_to_student_1.isTrainerAssignedToStudent)(userId, trainingWeek.userId);
        if (!isAssigned) {
            return reply.status(403).send({ message: 'You are not assigned to this student' });
        }
    }
    const updatedTrainingWeek = await (0, update_training_week_1.updateTrainingWeek)(id, updateData);
    return reply.send(updatedTrainingWeek);
}
