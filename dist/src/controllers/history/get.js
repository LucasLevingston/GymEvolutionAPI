"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryController = getHistoryController;
const get_user_history_1 = require("services/history/get-user-history");
async function getHistoryController(request, reply) {
    try {
        const { id } = request.params;
        const history = await (0, get_user_history_1.getUserHistory)(id);
        if (!history) {
            return reply.code(404).send({ error: 'History entry not found' });
        }
        return history;
    }
    catch (error) {
        throw error;
    }
}
