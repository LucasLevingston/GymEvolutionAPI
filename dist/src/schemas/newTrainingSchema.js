"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingWeekSchema = void 0;
const zod_1 = require("zod");
const trainingDaySchema_1 = require("./trainingDaySchema");
exports.trainingWeekSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    weekNumber: zod_1.z.number().int().positive().optional(),
    current: zod_1.z.boolean().optional(),
    information: zod_1.z.string().optional().nullable(),
    done: zod_1.z.boolean().optional(),
    trainingDays: zod_1.z.array(trainingDaySchema_1.trainingDaySchema).optional(),
    userId: zod_1.z.string().uuid().optional(),
});
