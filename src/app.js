const express = require("express");
const Database = require("better-sqlite3");
const { config } = require("./config");
const { createMoviesRouter } = require("./routes/movies");
const { createMoviesService } = require("./services/movies");
const { createMoviesRepository } = require("./repositories/movies");

const createApp = ({ moviesService }) => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/movies", createMoviesRouter({ moviesService }));

  app.use((error, _request, response, _next) => {
    response.status(500).json({ error: "An unexpected error occurred." });
  });

  return app;
};

const createAppRuntime = () => {
  const { moviesDbPath } = config;
  const moviesDb = new Database(moviesDbPath, { readonly: true });
  const moviesRepository = createMoviesRepository({ moviesDb });
  const moviesService = createMoviesService({ moviesRepository });
  const app = createApp({ moviesService });

  return {
    app,
    close: () => moviesDb.close(),
  };
};

module.exports = {
  createApp,
  createAppRuntime,
};
