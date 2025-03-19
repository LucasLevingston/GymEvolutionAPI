"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historySchema = void 0;
const zod_1 = require("zod");
exports.historySchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    event: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
});
