"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponseSchema = void 0;
const zod_1 = require("zod");
exports.errorResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
    errors: zod_1.z.record(zod_1.z.any()).optional(),
});
