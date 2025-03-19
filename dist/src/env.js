"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3000),
    JWT_SECRET_KEY: zod_1.z.string(),
    DATABASE_URL: zod_1.z.string(),
    NODEMAILER_PASS: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string(),
    HOST: zod_1.z.string(),
});
exports.env = {
    ...envSchema.parse(process.env),
};
