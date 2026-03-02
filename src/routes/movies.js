const express = require("express");

const createMoviesRouter = ({ moviesService }) => {
  const router = express.Router();

  router.get("/", ({ query }, response, next) => {
    try {
      const { page } = query;
      const result = moviesService.listAllMovies({ page });
      response.json(result);
    } catch (error) {
      if (error.message.includes("page")) {
        response.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  });

  return router;
};

module.exports = {
  createMoviesRouter,
};
