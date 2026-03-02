"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const movies_1 = require("../src/services/movies");
describe("Unit: movies service", () => {
    test("listAllMovies defaults page to 1 and requests first 50 rows", () => {
        const moviesRepository = {
            listAll: jest.fn().mockReturnValue([]),
            listByYear: jest.fn(),
            listByGenre: jest.fn(),
            findByMovieId: jest.fn(),
        };
        const ratingsRepository = {
            getAverageForMovieId: jest.fn(),
        };
        const moviesService = (0, movies_1.createMoviesService)({
            moviesRepository,
            ratingsRepository,
        });
        const result = moviesService.listAllMovies({});
        expect(moviesRepository.listAll).toHaveBeenCalledWith({
            limit: 50,
            offset: 0,
        });
        expect(result.pagination).toEqual({ page: 1, pageSize: 50 });
        expect(result.data).toEqual([]);
    });
    test("listMoviesByYear supports descending sort and second page", () => {
        const moviesRepository = {
            listAll: jest.fn(),
            listByYear: jest.fn().mockReturnValue([]),
            listByGenre: jest.fn(),
            findByMovieId: jest.fn(),
        };
        const ratingsRepository = {
            getAverageForMovieId: jest.fn(),
        };
        const moviesService = (0, movies_1.createMoviesService)({
            moviesRepository,
            ratingsRepository,
        });
        const result = moviesService.listMoviesByYear({
            year: "2014",
            page: 2,
            sort: "desc",
        });
        expect(moviesRepository.listByYear).toHaveBeenCalledWith({
            year: "2014",
            limit: 50,
            offset: 50,
            descending: true,
        });
        expect(result.pagination).toEqual({ page: 2, pageSize: 50 });
        expect(result.data).toEqual([]);
    });
    test("getMovieDetails maps movie and ratings fields", () => {
        const moviesRepository = {
            listAll: jest.fn(),
            listByYear: jest.fn(),
            listByGenre: jest.fn(),
            findByMovieId: jest.fn().mockReturnValue({
                movieId: 11,
                imdbId: "tt0076759",
                title: "Star Wars",
                overview: "Space opera",
                releaseDate: "1977-05-25",
                budget: 11000000,
                runtime: 121,
                language: "en",
                genres: '[{"id":12,"name":"Adventure"}]',
                productionCompanies: '[{"id":1,"name":"Lucasfilm"}]',
            }),
        };
        const ratingsRepository = {
            getAverageForMovieId: jest.fn().mockReturnValue({ averageRating: 3.689 }),
        };
        const moviesService = (0, movies_1.createMoviesService)({
            moviesRepository,
            ratingsRepository,
        });
        const result = moviesService.getMovieDetails({ movieId: 11 });
        expect(moviesRepository.findByMovieId).toHaveBeenCalledWith({ movieId: 11 });
        expect(ratingsRepository.getAverageForMovieId).toHaveBeenCalledWith({
            movieId: 11,
        });
        expect(result).toEqual({
            movieId: 11,
            imdbId: "tt0076759",
            title: "Star Wars",
            description: "Space opera",
            releaseDate: "1977-05-25",
            budget: "$11,000,000",
            runtime: 121,
            averageRating: 3.689,
            genres: [{ id: 12, name: "Adventure" }],
            originalLanguage: "en",
            productionCompanies: [{ id: 1, name: "Lucasfilm" }],
        });
    });
    test("getMovieDetails returns null when movie is missing", () => {
        const moviesRepository = {
            listAll: jest.fn(),
            listByYear: jest.fn(),
            listByGenre: jest.fn(),
            findByMovieId: jest.fn().mockReturnValue(null),
        };
        const ratingsRepository = {
            getAverageForMovieId: jest.fn(),
        };
        const moviesService = (0, movies_1.createMoviesService)({
            moviesRepository,
            ratingsRepository,
        });
        const result = moviesService.getMovieDetails({ movieId: 999999 });
        expect(result).toBeNull();
        expect(ratingsRepository.getAverageForMovieId).not.toHaveBeenCalled();
    });
});
