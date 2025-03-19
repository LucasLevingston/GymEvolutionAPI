"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingDayRoutes = trainingDayRoutes;
const authenticate_1 = require("../middlewares/authenticate");
async function trainingDayRoutes(app) {
    // All routes require authentication
    app.addHook('onRequest', authenticate_1.authenticate);
    // app.post("/", trainingDayController.createTrainingDay)
    // app.get("/:id", trainingDayController.getTrainingDayById)
    // app.put("/:id", trainingDayController.updateTrainingDay)
    // app.delete("/:id", trainingDayController.deleteTrainingDay)
    // app.patch("/:id/done", trainingDayController.markTrainingDayAsDone)
}
