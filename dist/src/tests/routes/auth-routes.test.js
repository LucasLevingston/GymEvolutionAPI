"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const auth_routes_1 = require("../../routes/auth-routes");
const auth_controller_1 = require("../../controllers/auth-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/auth-controller', () => {
    return {
        AuthController: vitest_1.vi.fn().mockImplementation(() => ({
            register: vitest_1.vi.fn(),
            login: vitest_1.vi.fn(),
            forgotPassword: vitest_1.vi.fn(),
            resetPassword: vitest_1.vi.fn(),
            getCurrentUser: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('Auth Routes', () => {
    let server;
    let authController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        await server.register(auth_routes_1.authRoutes);
        // Get the mocked controller instance
        authController = auth_controller_1.AuthController.mock.results[0].value;
        // Set up the mock implementations
        authController.register.mockImplementation(async (req, reply) => {
            return reply.status(201).send(services_1.mockAuthService.register());
        });
        authController.login.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockAuthService.login());
        });
        authController.forgotPassword.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockAuthService.forgotPassword());
        });
        authController.resetPassword.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockAuthService.resetPassword());
        });
        authController.getCurrentUser.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockAuthService.getCurrentUser());
        });
    });
    (0, vitest_1.describe)('POST /register', () => {
        (0, vitest_1.it)('should register a new user', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'STUDENT',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(201);
            (0, vitest_1.expect)(authController.register).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('user');
            (0, vitest_1.expect)(responseBody).toHaveProperty('token');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/register',
                payload: {
                    // Missing required fields
                    email: 'test@example.com',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('POST /login', () => {
        (0, vitest_1.it)('should login a user', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(authController.login).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('user');
            (0, vitest_1.expect)(responseBody).toHaveProperty('token');
        });
        (0, vitest_1.it)('should validate the request body', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    // Missing password
                    email: 'test@example.com',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(400);
        });
    });
    (0, vitest_1.describe)('POST /forgot-password', () => {
        (0, vitest_1.it)('should send a password reset link', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/forgot-password',
                payload: {
                    email: 'test@example.com',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(authController.forgotPassword).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
            (0, vitest_1.expect)(responseBody).toHaveProperty('resetToken');
        });
    });
    (0, vitest_1.describe)('POST /reset-password', () => {
        (0, vitest_1.it)('should reset a user password', async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/reset-password',
                payload: {
                    token: 'reset-token',
                    password: 'new-password',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(authController.resetPassword).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('message');
        });
    });
    (0, vitest_1.describe)('GET /me', () => {
        (0, vitest_1.it)('should get the current user', async () => {
            // Mock the JWT verification
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
            const response = await server.inject({
                method: 'GET',
                url: '/me',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(authController.getCurrentUser).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(responseBody).toHaveProperty('id');
            (0, vitest_1.expect)(responseBody).toHaveProperty('name');
            (0, vitest_1.expect)(responseBody).toHaveProperty('email');
            (0, vitest_1.expect)(responseBody).toHaveProperty('role');
        });
        (0, vitest_1.it)('should return 401 if not authenticated', async () => {
            // Mock JWT verification to fail
            server.jwt.verify = vitest_1.vi.fn().mockImplementation(() => {
                throw new Error('Unauthorized');
            });
            const response = await server.inject({
                method: 'GET',
                url: '/me',
            });
            (0, vitest_1.expect)(response.statusCode).toBe(401);
        });
    });
});
