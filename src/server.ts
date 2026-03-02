import { config } from "./config";
import { createDbRuntime } from "./db";
import { createMoviesService } from "./services/movies";
import { createMoviesRepository } from "./repositories/movies";
import { createRatingsRepository } from "./repositories/ratings";
import { createApp } from "./app";

export const init = () => {
  const dbRuntime = createDbRuntime({
    moviesDbPath: config.moviesDbPath,
    ratingsDbPath: config.ratingsDbPath,
  });
  const moviesRepository = createMoviesRepository({ moviesDb: dbRuntime.moviesDb });
  const ratingsRepository = createRatingsRepository({ ratingsDb: dbRuntime.ratingsDb });
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

export function main() {
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
