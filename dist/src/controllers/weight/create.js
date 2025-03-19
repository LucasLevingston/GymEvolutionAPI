"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeightController = createWeightController;
const add_weight_record_1 = require("services/weight/add-weight-record");
async function createWeightController(request) {
    try {
        const weight = await (0, add_weight_record_1.addWeightRecord)(request.body);
        return weight;
    }
    catch (error) {
        throw error;
    }
}
