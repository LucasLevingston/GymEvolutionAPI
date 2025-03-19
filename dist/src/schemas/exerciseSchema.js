"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseSchema = void 0;
const zod_1 = require("zod");
const serieSchema_1 = require("./serieSchema");
exports.exerciseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().optional(),
    variation: zod_1.z.string().optional().nullable(),
    repetitions: zod_1.z.number().int().positive().optional().nullable(),
    sets: zod_1.z.number().int().positive().optional().nullable(),
    done: zod_1.z.boolean().optional(),
    seriesResults: zod_1.z.array(serieSchema_1.serieSchema).optional(),
});
