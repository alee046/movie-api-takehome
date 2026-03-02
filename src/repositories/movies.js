const createMoviesRepository = ({ moviesDb }) => {
  const listMoviesStatement = moviesDb.prepare(
    `SELECT imdbId, title, genres, releaseDate, budget
     FROM movies
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`
  );

  return {
    listAll: ({ limit, offset }) => listMoviesStatement.all(limit, offset),
  };
};

module.exports = {
  createMoviesRepository,
};
