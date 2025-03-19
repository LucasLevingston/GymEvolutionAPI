"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightController = getWeightController;
const client_error_1 = require("errors/client-error");
const get_weight_history_1 = require("services/weight/get-weight-history");
async function getWeightController(request) {
    try {
        const { id } = request.params;
        const weight = await (0, get_weight_history_1.getWeightHistory)(id);
        if (!weight) {
            throw new client_error_1.ClientError('Weight entry not found');
        }
        return weight;
    }
    catch (error) {
        throw error;
    }
}
