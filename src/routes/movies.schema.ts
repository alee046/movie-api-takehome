import { z } from "zod";

export const listMoviesQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
});

export const moviesByYearParamsSchema = z.object({
  year: z.string().trim().regex(/^\d{4}$/, "Path parameter 'year' must be YYYY."),
});

export const moviesByYearQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  sort: z.enum(["asc", "desc"]).catch("asc"),
});

export const moviesByGenreParamsSchema = z.object({
  genre: z.string().trim().min(1, "Path parameter 'genre' is required."),
});

export const movieDetailsParamsSchema = z.object({
  movieId: z.coerce
    .number()
    .int()
    .positive("Path parameter 'movieId' must be a positive integer."),
});
