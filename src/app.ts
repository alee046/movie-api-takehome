import express, { NextFunction, Request, Response } from "express";
import { createMoviesRouter } from "./routes/movies";
import type { MoviesService } from "./services/movies";

export const createApp = ({ moviesService }: { moviesService: MoviesService }) => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_request: Request, response: Response) => {
    response.json({ status: "ok" });
  });

  app.use("/movies", createMoviesRouter({ moviesService }));

  app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    response.status(500).json({ error: "An unexpected error occurred." });
  });

  return app;
};
