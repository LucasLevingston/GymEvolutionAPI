"use strict";
// import Fastify, { type FastifyInstance } from 'fastify';
// import fastifyJwt from '@fastify/jwt';
// import {
//   type ZodTypeProvider,
//   serializerCompiler,
//   validatorCompiler,
// } from 'fastify-type-provider-zod';
// import { errorHandler } from '../../utils/error-handler';
// import { vi } from 'vitest';
// export function buildTestServer(): FastifyInstance {
//   const server = Fastify().withTypeProvider<ZodTypeProvider>();
//   server.register(fastifyJwt, {
//     secret: 'test-secret',
//   });
//   server.setErrorHandler(errorHandler);
//   server.setValidatorCompiler(validatorCompiler);
//   server.setSerializerCompiler(serializerCompiler);
//   return server;
// }
// export function createMockRequest(overrides = {}) {
//   return {
//     user: { id: 'user-id', role: 'STUDENT' },
//     params: {},
//     query: {},
//     body: {},
//     jwtVerify: vi.fn().mockResolvedValue(true),
//     ...overrides,
//   };
// }
// // Helper to create a mock reply
// export function createMockReply() {
//   const reply = {
//     status: vi.fn().mockReturnThis(),
//     send: vi.fn().mockReturnThis(),
//     code: vi.fn().mockReturnThis(),
//   };
//   return reply;
// }
