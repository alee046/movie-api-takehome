const createMoviesRepository = ({ moviesDb }) => {
  const listMoviesStatement = moviesDb.prepare(
    `SELECT imdbId, title, genres, releaseDate, budget
     FROM movies
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`
  );
  const listByYearStatementCache = new Map();
  const movieDetailsStatement = moviesDb.prepare(
    `SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, language, genres, productionCompanies
     FROM movies
     WHERE movieId = ?`
  );

  const getListByYearStatement = ({ sortOrder }) => {
    if (!listByYearStatementCache.has(sortOrder)) {
      listByYearStatementCache.set(
        sortOrder,
        moviesDb.prepare(
          `SELECT imdbId, title, genres, releaseDate, budget
           FROM movies
           WHERE substr(releaseDate, 1, 4) = ?
           ORDER BY releaseDate ${sortOrder}, movieId ${sortOrder}
           LIMIT ? OFFSET ?`
        )
      );
    }

    return listByYearStatementCache.get(sortOrder);
  };

  return {
    listAll: ({ limit, offset }) => listMoviesStatement.all(limit, offset),
    listByYear: ({ year, limit, offset, descending }) => {
      const sortOrder = descending ? "DESC" : "ASC";
      return getListByYearStatement({ sortOrder }).all(year, limit, offset);
    },
    findByMovieId: ({ movieId }) => movieDetailsStatement.get(movieId),
  };
};

module.exports = {
  createMoviesRepository,
};
