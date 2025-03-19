"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTrainerController = assignTrainerController;
const assign_trainer_1 = require("../../services/user/assign-trainer");
async function assignTrainerController(request, reply) {
    const { role } = request.user;
    const { studentId, trainerId } = request.body;
    // Only trainers or admins can assign trainers
    if (role !== 'TRAINER' && role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Forbidden' });
    }
    const relationship = await (0, assign_trainer_1.assignTrainer)(trainerId, studentId);
    return reply.status(201).send(relationship);
}
