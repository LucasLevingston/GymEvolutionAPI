"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainerStudentsController = getTrainerStudentsController;
const get_trainer_students_1 = require("../../services/user/get-trainer-students");
async function getTrainerStudentsController(request, reply) {
    const { id: trainerId, role } = request.user;
    if (role !== 'TRAINER') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    const students = await (0, get_trainer_students_1.getTrainerStudents)(trainerId);
    return reply.send(students);
}
