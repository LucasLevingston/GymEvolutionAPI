"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_error_1 = require("../errors/client-error");
const env_1 = require("../env");
const { JWT_SECRET_KEY } = env_1.env;
const hashPassword = async (password) => {
    return await bcrypt_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return await bcrypt_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '10h' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
    catch (error) {
        throw new client_error_1.ClientError('Invalid token');
    }
};
exports.verifyToken = verifyToken;
