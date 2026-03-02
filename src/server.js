const { config } = require("./config");
const { createAppRuntime } = require("./app");

function main() {
  const { app, close } = createAppRuntime();

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
  main,
};
