"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markExerciseAsDoneController = void 0;
const client_error_1 = require("errors/client-error");
const get_exercise_by_id_1 = require("services/exercise/get-exercise-by-id");
const mark_exercise_as_done_1 = require("services/exercise/mark-exercise-as-done");
const get_training_day_by_id_1 = require("services/training-day/get-training-day-by-id");
const get_training_week_by_id_1 = require("services/training-week/get-training-week-by-id");
const is_trainer_assigned_to_student_1 = require("services/training-week/is-trainer-assigned-to-student");
const markExerciseAsDoneController = async (request, reply) => {
    const { id } = request.params;
    const { id: userId, role } = request.user;
    const exercise = await (0, get_exercise_by_id_1.getExerciseById)(id);
    const trainingDay = await (0, get_training_day_by_id_1.getTrainingDayById)(exercise.trainingDayId);
    const trainingWeek = await (0, get_training_week_by_id_1.getTrainingWeekById)(trainingDay.trainingWeekId);
    if (role === 'STUDENT' && trainingWeek.userId !== userId) {
        throw new client_error_1.ClientError('Forbidden');
    }
    if (role === 'TRAINER' && trainingWeek.userId !== userId) {
        const isAssigned = await (0, is_trainer_assigned_to_student_1.isTrainerAssignedToStudent)(userId, trainingWeek.userId);
        if (!isAssigned) {
            throw new client_error_1.ClientError('You are not assigned to this student');
        }
    }
    const updatedExercise = await (0, mark_exercise_as_done_1.markExerciseAsDone)(id);
    return reply.send(updatedExercise);
};
exports.markExerciseAsDoneController = markExerciseAsDoneController;
