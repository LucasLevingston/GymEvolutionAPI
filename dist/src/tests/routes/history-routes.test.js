"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const test_server_1 = require("../utils/test-server");
const history_routes_1 = require("../../routes/history-routes");
const history_controller_1 = require("../../controllers/history-controller");
const services_1 = require("../mocks/services");
vitest_1.vi.mock('../../controllers/history-controller', () => {
    return {
        HistoryController: vitest_1.vi.fn().mockImplementation(() => ({
            getUserHistory: vitest_1.vi.fn(),
        })),
    };
});
(0, vitest_1.describe)('History Routes', () => {
    let server;
    let historyController;
    (0, vitest_1.beforeEach)(async () => {
        server = (0, test_server_1.buildTestServer)();
        // Mock JWT verification
        server.jwt.verify = vitest_1.vi
            .fn()
            .mockReturnValue({ id: 'user-id', role: 'STUDENT' });
        await server.register(history_routes_1.historyRoutes);
        // Get the mocked controller instance
        historyController = history_controller_1.HistoryController.mock.results[0].value;
        // Set up the mock implementations
        historyController.getUserHistory.mockImplementation(async (req, reply) => {
            return reply.send(services_1.mockHistoryService.getUserHistory());
        });
    });
    (0, vitest_1.describe)('GET /', () => {
        (0, vitest_1.it)('should get user history', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(historyController.getUserHistory).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
        (0, vitest_1.it)('should get history for a student', async () => {
            // Mock JWT verification for trainer
            server.jwt.verify = vitest_1.vi
                .fn()
                .mockReturnValue({ id: 'trainer-id', role: 'TRAINER' });
            const response = await server.inject({
                method: 'GET',
                url: '/?studentId=student-id',
                headers: {
                    authorization: 'Bearer token',
                },
            });
            (0, vitest_1.expect)(response.statusCode).toBe(200);
            (0, vitest_1.expect)(historyController.getUserHistory).toHaveBeenCalled();
            const responseBody = JSON.parse(response.body);
            (0, vitest_1.expect)(Array.isArray(responseBody)).toBe(true);
        });
    });
});
