const express = require("express");
const { createMoviesRouter } = require("./routes/movies");

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

module.exports = {
  createApp,
};
