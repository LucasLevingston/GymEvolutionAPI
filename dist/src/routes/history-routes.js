"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRoutes = historyRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const get_1 = require("controllers/history/get");
const error_schema_1 = require("schemas/error-schema");
async function historyRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', authenticate_1.authenticate);
    const getUserHistoryQuerySchema = zod_1.z.object({
        studentId: zod_1.z.string().uuid().optional(),
    });
    const historyResponseSchema = zod_1.z.object({
        id: zod_1.z.string().uuid(),
        event: zod_1.z.string(),
        date: zod_1.z.string(),
        userId: zod_1.z.string(),
        createdAt: zod_1.z.date(),
    });
    server.get('/', {
        schema: {
            querystring: getUserHistoryQuerySchema,
            response: {
                200: zod_1.z.array(historyResponseSchema),
                401: error_schema_1.errorResponseSchema,
                403: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['history'],
            summary: 'Get user history',
            description: 'Get history for a user',
            security: [{ bearerAuth: [] }],
        },
    }, get_1.getHistoryController);
}
