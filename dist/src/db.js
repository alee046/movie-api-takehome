"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbRuntime = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const createDbRuntime = ({ moviesDbPath, ratingsDbPath }) => {
    const moviesDb = new better_sqlite3_1.default(moviesDbPath, { readonly: true });
    const ratingsDb = new better_sqlite3_1.default(ratingsDbPath, { readonly: true });
    return {
        moviesDb,
        ratingsDb,
        close: () => {
            moviesDb.close();
            ratingsDb.close();
        },
    };
};
exports.createDbRuntime = createDbRuntime;
