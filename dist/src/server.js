"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
exports.main = main;
const config_1 = require("./config");
const db_1 = require("./db");
const movies_1 = require("./services/movies");
const movies_2 = require("./repositories/movies");
const ratings_1 = require("./repositories/ratings");
const app_1 = require("./app");
const init = () => {
    const dbRuntime = (0, db_1.createDbRuntime)({
        moviesDbPath: config_1.config.moviesDbPath,
        ratingsDbPath: config_1.config.ratingsDbPath,
    });
    const moviesRepository = (0, movies_2.createMoviesRepository)({ moviesDb: dbRuntime.moviesDb });
    const ratingsRepository = (0, ratings_1.createRatingsRepository)({ ratingsDb: dbRuntime.ratingsDb });
    const moviesService = (0, movies_1.createMoviesService)({
        moviesRepository,
        ratingsRepository,
    });
    const app = (0, app_1.createApp)({ moviesService });
    return {
        app,
        close: dbRuntime.close,
    };
};
exports.init = init;
function main() {
    const { app, close } = (0, exports.init)();
    const server = app.listen(config_1.config.port, () => {
        console.log(`movie-api listening on port ${config_1.config.port}`);
    });
    const shutdown = () => {
        server.close(() => {
            close();
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
if (require.main === module) {
    main();
}
