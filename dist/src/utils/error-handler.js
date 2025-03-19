"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const client_error_1 = require("errors/client-error");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const zod_1 = require("zod");
const errorHandler = (error, request, reply) => {
    console.log(error);
    if (error instanceof zod_1.ZodError) {
        return reply
            .status(400)
            .send({ message: 'Invalid input', errors: error.flatten().fieldErrors });
    }
    if (error instanceof fastify_type_provider_zod_1.ResponseSerializationError) {
        console.log(error);
        return reply.status(400).send({ message: 'Invalid input', error: error.cause });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError ||
        error instanceof client_1.Prisma.PrismaClientValidationError) {
        switch (error.code) {
            case 'P2002':
                reply.status(409).send({
                    message: 'Error on database',
                    error: 'Already exists.',
                });
                return;
            case 'P2003':
                reply.status(400).send({
                    message: 'Error on database',
                    error: 'Foreign key constraint failed.',
                });
                return;
            case 'P2025':
                reply.status(404).send({ message: 'Error on database', error: 'Not found' });
                return;
            default:
                reply.status(500).send({
                    message: 'Database server error',
                    error: 'Database error',
                });
                return;
        }
    }
    if (error instanceof client_error_1.ClientError) {
        if (error.message === 'Forbidden') {
            return reply.status(403).send({ message: 'Forbidden' });
        }
        return reply.status(400).send({ message: error.message });
    }
    if (error instanceof SyntaxError && 'body' in error) {
        reply.status(400).send({ message: 'Invalid JSON payload' });
        return;
    }
    reply.status(500).send({ message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
