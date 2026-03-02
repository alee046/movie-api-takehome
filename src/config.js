const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
  quiet: true,
});

const config = {
  port: Number(process.env.PORT || 3000),
  logLevel: process.env.LOG_LEVEL || "info",
  moviesDbPath: path.resolve(process.env.MOVIES_DB_PATH || "./db/movies.db"),
  ratingsDbPath: path.resolve(process.env.RATINGS_DB_PATH || "./db/ratings.db"),
};

module.exports = {
  config,
};
