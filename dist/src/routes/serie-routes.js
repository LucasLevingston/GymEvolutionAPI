"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serieRoutes = serieRoutes;
const authenticate_1 = require("../middlewares/authenticate");
async function serieRoutes(app) {
    app.addHook('onRequest', authenticate_1.authenticate);
    // app.post('/', createSerie);
    // app.get('/:id', getSerieById);
    // app.put('/:id', updateSerie);
    // app.delete('/:id', deleteSerie);
}
