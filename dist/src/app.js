"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const movies_1 = require("./routes/movies");
const createApp = ({ moviesService }) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/health", (_request, response) => {
        response.json({ status: "ok" });
    });
    app.use("/movies", (0, movies_1.createMoviesRouter)({ moviesService }));
    app.use((error, _request, response, _next) => {
        response.status(500).json({ error: "An unexpected error occurred." });
    });
    return app;
};
exports.createApp = createApp;
