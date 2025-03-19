"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const vitest_mock_extended_1 = require("vitest-mock-extended");
// Mock the prisma client
vitest_1.vi.mock('../lib/prisma', () => ({
    prisma: (0, vitest_mock_extended_1.mockDeep)(),
}));
// Mock the JWT verification
vitest_1.vi.mock('@fastify/jwt', () => ({
    default: () => ({
        sign: vitest_1.vi.fn().mockReturnValue('mocked-token'),
        verify: vitest_1.vi.fn().mockReturnValue({ id: 'user-id', role: 'STUDENT' }),
    }),
}));
// Mock bcryptjs
vitest_1.vi.mock('bcryptjs', () => ({
    hash: vitest_1.vi.fn().mockResolvedValue('hashed-password'),
    compare: vitest_1.vi.fn().mockResolvedValue(true),
}));
