const express = require("express");
const { z, ZodError } = require("zod");

const listMoviesQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
});

const moviesByYearParamsSchema = z.object({
  year: z.string().trim().regex(/^\d{4}$/, "Path parameter 'year' must be YYYY."),
});

const moviesByYearQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  sort: z.enum(["asc", "desc"]).catch("asc"),
});

const moviesByGenreParamsSchema = z.object({
  genre: z.string().trim().min(1, "Path parameter 'genre' is required."),
});

const movieDetailsParamsSchema = z.object({
  movieId: z.coerce
    .number()
    .int()
    .positive("Path parameter 'movieId' must be a positive integer."),
});

const createMoviesRouter = ({ moviesService }) => {
  const router = express.Router();

  router.get("/", ({ query }, response, next) => {
    try {
      const { page } = listMoviesQuerySchema.parse(query);
      const result = moviesService.listAllMovies({ page });
      response.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: error.issues[0].message });
        return;
      }
      next(error);
    }
  });

  router.get("/year/:year", ({ params, query }, response, next) => {
    try {
      const { year } = moviesByYearParamsSchema.parse(params);
      const { page, sort } = moviesByYearQuerySchema.parse(query);
      const result = moviesService.listMoviesByYear({ year, page, sort });
      response.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: error.issues[0].message });
        return;
      }
      next(error);
    }
  });

  router.get("/genre/:genre", ({ params, query }, response, next) => {
    try {
      const { genre } = moviesByGenreParamsSchema.parse(params);
      const { page } = listMoviesQuerySchema.parse(query);
      const result = moviesService.listMoviesByGenre({ genre, page });
      response.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: error.issues[0].message });
        return;
      }
      next(error);
    }
  });

  router.get("/:movieId", ({ params }, response, next) => {
    try {
      const { movieId } = movieDetailsParamsSchema.parse(params);
      const movieDetails = moviesService.getMovieDetails({ movieId });

      if (!movieDetails) {
        response.status(404).json({ error: "Movie not found." });
        return;
      }

      response.json(movieDetails);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: error.issues[0].message });
        return;
      }
      next(error);
    }
  });

  return router;
};

module.exports = {
  createMoviesRouter,
};
