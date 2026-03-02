import Database from "better-sqlite3";

type MoviesRow = {
  movieId: number;
  imdbId: string;
  title: string;
  genres: string | null;
  releaseDate: string | null;
  budget: number | null;
};

type MovieDetailsRow = {
  movieId: number;
  imdbId: string;
  title: string;
  overview: string | null;
  releaseDate: string | null;
  budget: number | null;
  runtime: number | null;
  language: string | null;
  genres: string | null;
  productionCompanies: string | null;
};

type CreateMoviesRepositoryInput = {
  moviesDb: Database.Database;
};

export const createMoviesRepository = ({ moviesDb }: CreateMoviesRepositoryInput) => {
  const listMoviesStatement = moviesDb.prepare<[number, number], MoviesRow>(
    `SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`
  );
  const listByYearAscStatement = moviesDb.prepare<[string, number, number], MoviesRow>(
    `SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE substr(releaseDate, 1, 4) = ?
     ORDER BY releaseDate ASC, movieId ASC
     LIMIT ? OFFSET ?`
  );
  const listByYearDescStatement = moviesDb.prepare<[string, number, number], MoviesRow>(
    `SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE substr(releaseDate, 1, 4) = ?
     ORDER BY releaseDate DESC, movieId DESC
     LIMIT ? OFFSET ?`
  );
  const listByGenreStatement = moviesDb.prepare<[string, number, number], MoviesRow>(
    `SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE EXISTS (
       SELECT 1
       FROM json_each(movies.genres) AS genre
       WHERE lower(json_extract(genre.value, '$.name')) = lower(?)
     )
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`
  );
  const movieDetailsByMovieIdStatement = moviesDb.prepare<[number], MovieDetailsRow>(
    `SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, language, genres, productionCompanies
     FROM movies
     WHERE movieId = ?`
  );

  return {
    listAll: ({ limit, offset }: { limit: number; offset: number }) =>
      listMoviesStatement.all(limit, offset),
    listByYear: ({
      year,
      limit,
      offset,
      descending,
    }: {
      year: string;
      limit: number;
      offset: number;
      descending: boolean;
    }) => {
      const statement = descending ? listByYearDescStatement : listByYearAscStatement;
      return statement.all(year, limit, offset);
    },
    listByGenre: ({
      genre,
      limit,
      offset,
    }: {
      genre: string;
      limit: number;
      offset: number;
    }) => listByGenreStatement.all(genre, limit, offset),
    findByMovieId: ({ movieId }: { movieId: number }) =>
      movieDetailsByMovieIdStatement.get(movieId) ?? null,
  };
};
