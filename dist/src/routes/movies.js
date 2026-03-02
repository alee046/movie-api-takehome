"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMoviesRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const movies_schema_1 = require("./movies.schema");
const createMoviesRouter = ({ moviesService }) => {
    const router = express_1.default.Router();
    router.get("/", ({ query }, response, next) => {
        try {
            const { page } = movies_schema_1.listMoviesQuerySchema.parse(query);
            const result = moviesService.listAllMovies({ page });
            response.json(result);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                response.status(400).json({ error: error.issues[0].message });
                return;
            }
            next(error);
        }
    });
    router.get("/year/:year", ({ params, query }, response, next) => {
        try {
            const { year } = movies_schema_1.moviesByYearParamsSchema.parse(params);
            const { page, sort } = movies_schema_1.moviesByYearQuerySchema.parse(query);
            const result = moviesService.listMoviesByYear({ year, page, sort });
            response.json(result);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                response.status(400).json({ error: error.issues[0].message });
                return;
            }
            next(error);
        }
    });
    router.get("/genre/:genre", ({ params, query }, response, next) => {
        try {
            const { genre } = movies_schema_1.moviesByGenreParamsSchema.parse(params);
            const { page } = movies_schema_1.listMoviesQuerySchema.parse(query);
            const result = moviesService.listMoviesByGenre({ genre, page });
            response.json(result);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                response.status(400).json({ error: error.issues[0].message });
                return;
            }
            next(error);
        }
    });
    router.get("/:movieId", ({ params }, response, next) => {
        try {
            const { movieId } = movies_schema_1.movieDetailsParamsSchema.parse(params);
            const movieDetails = moviesService.getMovieDetails({ movieId });
            if (!movieDetails) {
                response.status(404).json({ error: "Movie not found." });
                return;
            }
            response.json(movieDetails);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                response.status(400).json({ error: error.issues[0].message });
                return;
            }
            next(error);
        }
    });
    return router;
};
exports.createMoviesRouter = createMoviesRouter;
