"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serieSchema = void 0;
const zod_1 = require("zod");
exports.serieSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    seriesIndex: zod_1.z.number().int().positive().optional().nullable(),
    repetitions: zod_1.z.number().int().positive().optional().nullable(),
    weight: zod_1.z.number().positive().optional().nullable(),
});
