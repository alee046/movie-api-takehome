"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMoviesRepository = void 0;
const createMoviesRepository = ({ moviesDb }) => {
    const listMoviesStatement = moviesDb.prepare(`SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`);
    const listByYearAscStatement = moviesDb.prepare(`SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE substr(releaseDate, 1, 4) = ?
     ORDER BY releaseDate ASC, movieId ASC
     LIMIT ? OFFSET ?`);
    const listByYearDescStatement = moviesDb.prepare(`SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE substr(releaseDate, 1, 4) = ?
     ORDER BY releaseDate DESC, movieId DESC
     LIMIT ? OFFSET ?`);
    const listByGenreStatement = moviesDb.prepare(`SELECT movieId, imdbId, title, genres, releaseDate, budget
     FROM movies
     WHERE EXISTS (
       SELECT 1
       FROM json_each(movies.genres) AS genre
       WHERE lower(json_extract(genre.value, '$.name')) = lower(?)
     )
     ORDER BY movieId ASC
     LIMIT ? OFFSET ?`);
    const movieDetailsByMovieIdStatement = moviesDb.prepare(`SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, language, genres, productionCompanies
     FROM movies
     WHERE movieId = ?`);
    return {
        listAll: ({ limit, offset }) => listMoviesStatement.all(limit, offset),
        listByYear: ({ year, limit, offset, descending, }) => {
            const statement = descending ? listByYearDescStatement : listByYearAscStatement;
            return statement.all(year, limit, offset);
        },
        listByGenre: ({ genre, limit, offset, }) => listByGenreStatement.all(genre, limit, offset),
        findByMovieId: ({ movieId }) => movieDetailsByMovieIdStatement.get(movieId) ?? null,
    };
};
exports.createMoviesRepository = createMoviesRepository;
