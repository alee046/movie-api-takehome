const express = require("express");

const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use((error, _request, response, _next) => {
    response.status(500).json({ error: "An unexpected error occurred." });
  });

  return app;
};

module.exports = {
  createApp,
};
