"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponseSchema = exports.userRoleSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const newTrainingSchema_1 = require("./newTrainingSchema");
const weightSchema_1 = require("./weightSchema");
const dietSchema_1 = require("./dietSchema");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string(),
    name: zod_1.z.string().optional().nullable(),
    sex: zod_1.z.string().optional().nullable(),
    street: zod_1.z.string().optional().nullable(),
    number: zod_1.z.string().optional().nullable(),
    zipCode: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().optional().nullable(),
    state: zod_1.z.string().optional().nullable(),
    birthDate: zod_1.z.string().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    currentWeight: zod_1.z.string().optional().nullable(),
    trainingWeeks: zod_1.z.array(newTrainingSchema_1.trainingWeekSchema).optional(),
    history: zod_1.z.any().optional(),
    oldWeights: zod_1.z.array(weightSchema_1.weightSchema).optional(),
    diets: zod_1.z.array(dietSchema_1.dietSchema).optional(),
});
exports.userRoleSchema = zod_1.z.enum(['STUDENT', 'NUTRITIONIST', 'TRAINER', 'ADMIN']);
exports.userResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().nullable(),
    email: zod_1.z.string().email(),
    role: zod_1.z.string(),
    createdAt: zod_1.z.date(),
});
