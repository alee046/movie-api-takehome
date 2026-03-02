"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieDetailsParamsSchema = exports.moviesByGenreParamsSchema = exports.moviesByYearQuerySchema = exports.moviesByYearParamsSchema = exports.listMoviesQuerySchema = void 0;
const zod_1 = require("zod");
exports.listMoviesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().catch(1),
});
exports.moviesByYearParamsSchema = zod_1.z.object({
    year: zod_1.z.string().trim().regex(/^\d{4}$/, "Path parameter 'year' must be YYYY."),
});
exports.moviesByYearQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().catch(1),
    sort: zod_1.z.enum(["asc", "desc"]).catch("asc"),
});
exports.moviesByGenreParamsSchema = zod_1.z.object({
    genre: zod_1.z.string().trim().min(1, "Path parameter 'genre' is required."),
});
exports.movieDetailsParamsSchema = zod_1.z.object({
    movieId: zod_1.z.coerce
        .number()
        .int()
        .positive("Path parameter 'movieId' must be a positive integer."),
});
