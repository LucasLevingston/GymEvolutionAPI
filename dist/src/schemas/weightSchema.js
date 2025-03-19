"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightSchema = void 0;
const zod_1 = require("zod");
exports.weightSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    weight: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    bf: zod_1.z.string().optional(),
    userId: zod_1.z.string().uuid().optional(),
});
