import express, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { MoviesService } from "../services/movies";
import {
  listMoviesQuerySchema,
  moviesByYearParamsSchema,
  moviesByYearQuerySchema,
  moviesByGenreParamsSchema,
  movieDetailsParamsSchema,
} from "./movies.schema";

export const createMoviesRouter = ({ moviesService }: { moviesService: MoviesService }) => {
  const router = express.Router();

  router.get("/", ({ query }: Request, response: Response, next: NextFunction) => {
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

  router.get("/year/:year", ({ params, query }: Request, response: Response, next: NextFunction) => {
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

  router.get("/genre/:genre", ({ params, query }: Request, response: Response, next: NextFunction) => {
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

  router.get("/:movieId", ({ params }: Request, response: Response, next: NextFunction) => {
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
