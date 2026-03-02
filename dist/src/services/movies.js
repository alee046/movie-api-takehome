"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMoviesService = void 0;
const utils_1 = require("../utils");
const createMoviesService = ({ moviesRepository, ratingsRepository, }) => {
    const listAllMovies = ({ page }) => {
        const pageNumber = page ?? 1;
        const offset = (pageNumber - 1) * utils_1.MOVIES_PAGE_SIZE;
        const rows = moviesRepository.listAll({ limit: utils_1.MOVIES_PAGE_SIZE, offset });
        return {
            data: rows.map(utils_1.formatListItem),
            pagination: {
                page: pageNumber,
                pageSize: utils_1.MOVIES_PAGE_SIZE,
            },
        };
    };
    const listMoviesByYear = ({ year, page, sort, }) => {
        const pageNumber = page ?? 1;
        const sortDirection = sort ?? "asc";
        const offset = (pageNumber - 1) * utils_1.MOVIES_PAGE_SIZE;
        const rows = moviesRepository.listByYear({
            year,
            limit: utils_1.MOVIES_PAGE_SIZE,
            offset,
            descending: sortDirection === "desc",
        });
        return {
            data: rows.map(utils_1.formatListItem),
            pagination: {
                page: pageNumber,
                pageSize: utils_1.MOVIES_PAGE_SIZE,
            },
        };
    };
    const listMoviesByGenre = ({ genre, page }) => {
        const pageNumber = page ?? 1;
        const offset = (pageNumber - 1) * utils_1.MOVIES_PAGE_SIZE;
        const rows = moviesRepository.listByGenre({
            genre,
            limit: utils_1.MOVIES_PAGE_SIZE,
            offset,
        });
        return {
            data: rows.map(utils_1.formatListItem),
            pagination: {
                page: pageNumber,
                pageSize: utils_1.MOVIES_PAGE_SIZE,
            },
        };
    };
    const getMovieDetails = ({ movieId }) => {
        const movie = moviesRepository.findByMovieId({ movieId });
        if (!movie) {
            return null;
        }
        const ratingAggregate = ratingsRepository.getAverageForMovieId({
            movieId: movie.movieId,
        });
        const averageRating = ratingAggregate?.averageRating ?? 0;
        return {
            movieId: movie.movieId,
            imdbId: movie.imdbId,
            title: movie.title,
            description: movie.overview || "",
            releaseDate: movie.releaseDate,
            budget: (0, utils_1.formatBudget)(movie.budget),
            runtime: movie.runtime ?? 0,
            averageRating,
            genres: (0, utils_1.parseJsonArray)(movie.genres),
            originalLanguage: movie.language || "",
            productionCompanies: (0, utils_1.parseJsonArray)(movie.productionCompanies),
        };
    };
    return {
        listAllMovies,
        listMoviesByYear,
        listMoviesByGenre,
        getMovieDetails,
    };
};
exports.createMoviesService = createMoviesService;
