"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestServer = buildTestServer;
exports.createMockRequest = createMockRequest;
exports.createMockReply = createMockReply;
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const error_handler_1 = require("../../utils/error-handler");
const vitest_1 = require("vitest");
function buildTestServer() {
    const server = (0, fastify_1.default)().withTypeProvider();
    // Register plugins
    server.register(jwt_1.default, {
        secret: 'test-secret',
    });
    // Set up error handler and compilers
    server.setErrorHandler(error_handler_1.errorHandler);
    server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    return server;
}
// Helper to create a mock request
function createMockRequest(overrides = {}) {
    return {
        user: { id: 'user-id', role: 'STUDENT' },
        params: {},
        query: {},
        body: {},
        jwtVerify: vitest_1.vi.fn().mockResolvedValue(true),
        ...overrides,
    };
}
// Helper to create a mock reply
function createMockReply() {
    const reply = {
        status: vitest_1.vi.fn().mockReturnThis(),
        send: vitest_1.vi.fn().mockReturnThis(),
        code: vitest_1.vi.fn().mockReturnThis(),
    };
    return reply;
}
