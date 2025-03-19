"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const client_error_1 = require("../errors/client-error");
const get_user_by_id_1 = require("../services/user/get-user-by-id");
const authenticate = async (request) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new client_error_1.ClientError('Authorization header is missing');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new client_error_1.ClientError('Token is missing');
        }
        const payload = (0, jwt_1.verifyToken)(token);
        const tokenUserId = payload.userId;
        if (!tokenUserId || typeof tokenUserId !== 'string') {
            throw new client_error_1.ClientError('Invalid token');
        }
        const user = await (0, get_user_by_id_1.getUserByIdService)(tokenUserId);
        if (!user) {
            throw new client_error_1.ClientError('User not found');
        }
        // request.user as User = user;
    }
    catch (error) {
        throw new client_error_1.ClientError(error.message);
    }
};
exports.authenticate = authenticate;
