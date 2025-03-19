"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWeightController = deleteWeightController;
const client_error_1 = require("errors/client-error");
const delete_1 = require("services/weight/delete");
const get_weight_history_1 = require("services/weight/get-weight-history");
async function deleteWeightController(request, reply) {
    try {
        const { id } = request.params;
        const weight = await (0, get_weight_history_1.getWeightHistory)(id);
        if (!weight) {
            throw new client_error_1.ClientError('Weight not found');
        }
        const result = await (0, delete_1.deleteWeightService)(id);
        return reply.send({ message: 'Weight entry deleted successfully' });
    }
    catch (error) {
        throw error;
    }
}
