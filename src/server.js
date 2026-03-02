const { config } = require("./config");
const { createDbRuntime } = require("./db");
const { createMoviesService } = require("./services/movies");
const { createMoviesRepository } = require("./repositories/movies");
const { createRatingsRepository } = require("./repositories/ratings");
const { createApp } = require("./app");

const init = () => {
  const dbRuntime = createDbRuntime({
    moviesDbPath: config.moviesDbPath,
    ratingsDbPath: config.ratingsDbPath,
  });
  const moviesRepository = createMoviesRepository({ moviesDb: dbRuntime.moviesDb });
  const ratingsRepository = createRatingsRepository({
    ratingsDb: dbRuntime.ratingsDb,
  });
  const moviesService = createMoviesService({
    moviesRepository,
    ratingsRepository,
  });
  const app = createApp({ moviesService });

  return {
    app,
    close: dbRuntime.close,
  };
};

function main() {
  const { app, close } = init();

  const server = app.listen(config.port, () => {
    console.log(`movie-api listening on port ${config.port}`);
  });

  const shutdown = () => {
    server.close(() => {
      close();
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  main();
}

module.exports = {
  init,
  main,
};
