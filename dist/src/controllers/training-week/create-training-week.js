"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingWeekController = createTrainingWeekController;
const create_training_week_1 = require("@/services/training-week/create-training-week");
const is_trainer_assigned_to_student_1 = require("@/services/training-week/is-trainer-assigned-to-student");
const client_error_1 = require("errors/client-error");
async function createTrainingWeekController(request) {
    try {
        const { id: userId, role } = request.user;
        const { weekNumber, information, studentId, trainingDays } = request.body;
        let targetUserId = userId;
        if (role === 'TRAINER' && studentId) {
            const isAssigned = await (0, is_trainer_assigned_to_student_1.isTrainerAssignedToStudent)(userId, studentId);
            if (!isAssigned) {
                throw new client_error_1.ClientError('You are not assigned to this student');
            }
            targetUserId = studentId;
        }
        else if (studentId && role !== 'STUDENT') {
            throw new client_error_1.ClientError('Only trainers can create training weeks for students');
        }
        const trainingWeek = await (0, create_training_week_1.createTrainingWeek)({
            weekNumber,
            information,
            userId: targetUserId,
            trainingDays,
        });
        return trainingWeek;
    }
    catch (error) {
        throw error;
    }
}
