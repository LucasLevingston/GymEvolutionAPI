"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTrainersController = getAllTrainersController;
const get_all_trainers_1 = require("../../services/user/get-all-trainers");
async function getAllTrainersController() {
    try {
        const trainers = await (0, get_all_trainers_1.getAllTrainers)();
        return trainers;
    }
    catch (error) {
        throw error;
    }
}
