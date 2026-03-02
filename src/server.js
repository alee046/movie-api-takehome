const { config } = require("./config");
const { createApp } = require("./app");

function main() {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`movie-api listening on port ${config.port}`);
  });

  const shutdown = () => {
    server.close();
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
