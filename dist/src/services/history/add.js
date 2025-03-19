"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToHistory = addToHistory;
const validate_event_1 = require("utils/validate-event");
const get_user_history_1 = require("./get-user-history");
const get_user_by_id_1 = require("services/user/get-user-by-id");
async function addToHistory(updatedUser) {
    try {
        const user = await (0, get_user_by_id_1.getUserByIdService)(updatedUser.id);
        if (!user) {
            throw new Error('User not found');
        }
        await (0, validate_event_1.validateEvent)(user, updatedUser);
        return await (0, get_user_history_1.getUserHistory)(user.email);
    }
    catch (error) {
        throw new Error('Error adding to history');
    }
}
