"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const authenticate_1 = require("../middlewares/authenticate");
const register_1 = require("../controllers/auth/register");
const login_1 = require("../controllers/auth/login");
const password_recover_1 = require("../controllers/auth/password-recover");
const reset_password_1 = require("../controllers/auth/reset-password");
const get_current_user_1 = require("../controllers/auth/get-current-user");
const error_schema_1 = require("schemas/error-schema");
const userSchema_1 = require("schemas/userSchema");
async function authRoutes(app) {
    const server = app.withTypeProvider();
    const registerSchema = zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    });
    const registerResponseSchema = zod_1.z.object({
        user: userSchema_1.userResponseSchema,
        token: zod_1.z.string(),
    });
    server.post('/register', {
        schema: {
            body: registerSchema,
            response: {
                201: registerResponseSchema,
                409: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['auth'],
            summary: 'Register a new user',
            description: 'Register a new user with name, email, password, and role',
        },
    }, register_1.registerController);
    const loginSchema = zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    });
    const loginResponseSchema = zod_1.z.object({
        user: userSchema_1.userSchema,
        token: zod_1.z.string(),
    });
    server.post('/login', {
        schema: {
            body: loginSchema,
            response: {
                200: loginResponseSchema,
                401: error_schema_1.errorResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['auth'],
            summary: 'Login a user',
            description: 'Login a user with email and password',
        },
    }, login_1.loginController);
    const forgotPasswordSchema = zod_1.z.object({
        email: zod_1.z.string().email(),
    });
    const forgotPasswordResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
        resetToken: zod_1.z.string().optional(),
    });
    server.post('/password-recover', {
        schema: {
            body: forgotPasswordSchema,
            response: {
                200: forgotPasswordResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['auth'],
            summary: 'Request password reset',
            description: 'Request a password reset link for a user',
        },
    }, password_recover_1.passwordRecover);
    const resetPasswordSchema = zod_1.z.object({
        token: zod_1.z.string(),
        password: zod_1.z.string().min(6),
    });
    const resetPasswordResponseSchema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    server.post('/reset-password', {
        schema: {
            body: resetPasswordSchema,
            response: {
                200: resetPasswordResponseSchema,
                400: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['auth'],
            summary: 'Reset password',
            description: 'Reset a user password with a valid token',
        },
    }, reset_password_1.resetPasswordController);
    server.get('/me', {
        onRequest: [authenticate_1.authenticate],
        schema: {
            response: {
                200: userSchema_1.userResponseSchema,
                401: error_schema_1.errorResponseSchema,
                404: error_schema_1.errorResponseSchema,
                500: error_schema_1.errorResponseSchema,
            },
            tags: ['auth'],
            summary: 'Get current user',
            description: 'Get the current authenticated user',
            security: [{ bearerAuth: [] }],
        },
    }, get_current_user_1.getCurrentUserController);
}
