"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
    quiet: true,
});
exports.config = {
    port: Number(process.env.PORT || 3000),
    logLevel: process.env.LOG_LEVEL || "info",
    moviesDbPath: path_1.default.resolve(process.env.MOVIES_DB_PATH || "./db/movies.db"),
    ratingsDbPath: path_1.default.resolve(process.env.RATINGS_DB_PATH || "./db/ratings.db"),
};
