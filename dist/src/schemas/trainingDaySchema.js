"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingDaySchema = void 0;
const zod_1 = require("zod");
const exerciseSchema_1 = require("./exerciseSchema");
exports.trainingDaySchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    group: zod_1.z.string().optional(),
    dayOfWeek: zod_1.z.string().optional(),
    done: zod_1.z.boolean().optional(),
    comments: zod_1.z.string().optional().nullable(),
    exercises: zod_1.z.array(exerciseSchema_1.exerciseSchema).optional(),
});
