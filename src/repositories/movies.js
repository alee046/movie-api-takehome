const createMoviesRepository = ({ moviesDb }) => {
  const listMoviesStatement = moviesDb.prepare(
    `SELECT imdbId, title, genres, releaseDate, budget
     FROM movies
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`
  );
  const movieDetailsStatement = moviesDb.prepare(
    `SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, language, genres, productionCompanies
     FROM movies
     WHERE movieId = ?`
  );

  return {
    listAll: ({ limit, offset }) => listMoviesStatement.all(limit, offset),
    findByMovieId: ({ movieId }) => movieDetailsStatement.get(movieId),
  };
};

module.exports = {
  createMoviesRepository,
};
