"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
describe("User Story: List All Movies", () => {
    test("GET /movies returns first page with required columns", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies");
            expect(response.status).toBe(200);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.pageSize).toBe(50);
            expect(response.body.data.length).toBe(50);
            const firstMovie = response.body.data[0];
            expect(Object.keys(firstMovie)).toEqual([
                "movieId",
                "imdbId",
                "title",
                "genres",
                "releaseDate",
                "budget",
            ]);
            expect(firstMovie.budget).toMatch(/^\$[\d,]+$/);
            expect(Array.isArray(firstMovie.genres)).toBe(true);
            expect(firstMovie.genres.length).toBeGreaterThan(0);
            expect(firstMovie.genres[0]).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            }));
        }
        finally {
            close();
        }
    });
    test("GET /movies?page=2 returns second page", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const page1 = await (0, supertest_1.default)(app).get("/movies?page=1");
            const page2 = await (0, supertest_1.default)(app).get("/movies?page=2");
            expect(page2.status).toBe(200);
            expect(page2.body.pagination.page).toBe(2);
            expect(page2.body.pagination.pageSize).toBe(50);
            expect(page2.body.data.length).toBe(50);
            expect(page1.body.data[0].imdbId).not.toBe(page2.body.data[0].imdbId);
        }
        finally {
            close();
        }
    });
});
describe("User Story: Movie Details", () => {
    test("GET /movies/:movieId returns required movie details columns", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies/11");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                movieId: 11,
                imdbId: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                releaseDate: expect.any(String),
                budget: expect.stringMatching(/^\$[\d,]+$/),
                runtime: expect.any(Number),
                averageRating: expect.any(Number),
                genres: expect.any(Array),
                originalLanguage: expect.any(String),
                productionCompanies: expect.any(Array),
            }));
            expect(response.body.genres[0]).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            }));
            expect(response.body.productionCompanies[0]).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            }));
        }
        finally {
            close();
        }
    });
    test("GET /movies/:movieId uses ratings from ratings database", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies/11");
            expect(response.status).toBe(200);
            expect(response.body.averageRating).toBeCloseTo(3.689, 3);
        }
        finally {
            close();
        }
    });
});
describe("User Story: Movies By Year", () => {
    test("GET /movies/year/:year returns paginated movies with required columns in chronological order", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies/year/2014");
            expect(response.status).toBe(200);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.pageSize).toBe(50);
            expect(response.body.data.length).toBe(50);
            const firstMovie = response.body.data[0];
            expect(Object.keys(firstMovie)).toEqual([
                "movieId",
                "imdbId",
                "title",
                "genres",
                "releaseDate",
                "budget",
            ]);
            expect(firstMovie.budget).toMatch(/^\$[\d,]+$/);
            const firstDate = response.body.data[0].releaseDate;
            const secondDate = response.body.data[1].releaseDate;
            expect(firstDate <= secondDate).toBe(true);
        }
        finally {
            close();
        }
    });
    test("GET /movies/year/:year?page=2 returns the second page", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const page1 = await (0, supertest_1.default)(app).get("/movies/year/2014?page=1");
            const page2 = await (0, supertest_1.default)(app).get("/movies/year/2014?page=2");
            expect(page2.status).toBe(200);
            expect(page2.body.pagination.page).toBe(2);
            expect(page2.body.pagination.pageSize).toBe(50);
            expect(page2.body.data.length).toBe(50);
            expect(page1.body.data[0].imdbId).not.toBe(page2.body.data[0].imdbId);
        }
        finally {
            close();
        }
    });
    test("GET /movies/year/:year?sort=desc returns movies in descending release date order", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies/year/2014?sort=desc");
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(50);
            const firstDate = response.body.data[0].releaseDate;
            const secondDate = response.body.data[1].releaseDate;
            expect(firstDate >= secondDate).toBe(true);
        }
        finally {
            close();
        }
    });
});
describe("User Story: Movies By Genre", () => {
    test("GET /movies/genre/:genre returns paginated movies with required columns", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const response = await (0, supertest_1.default)(app).get("/movies/genre/Drama");
            expect(response.status).toBe(200);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.pageSize).toBe(50);
            expect(response.body.data.length).toBe(50);
            const firstMovie = response.body.data[0];
            expect(Object.keys(firstMovie)).toEqual([
                "movieId",
                "imdbId",
                "title",
                "genres",
                "releaseDate",
                "budget",
            ]);
            expect(firstMovie.budget).toMatch(/^\$[\d,]+$/);
            expect(Array.isArray(firstMovie.genres)).toBe(true);
            expect(response.body.data.every((movie) => movie.genres.some((genre) => String(genre.name).toLowerCase() === "drama"))).toBe(true);
        }
        finally {
            close();
        }
    });
    test("GET /movies/genre/:genre?page=2 returns the second page", async () => {
        const { app, close } = (0, server_1.init)();
        try {
            const page1 = await (0, supertest_1.default)(app).get("/movies/genre/Drama?page=1");
            const page2 = await (0, supertest_1.default)(app).get("/movies/genre/Drama?page=2");
            expect(page2.status).toBe(200);
            expect(page2.body.pagination.page).toBe(2);
            expect(page2.body.pagination.pageSize).toBe(50);
            expect(page2.body.data.length).toBe(50);
            expect(page1.body.data[0].imdbId).not.toBe(page2.body.data[0].imdbId);
        }
        finally {
            close();
        }
    });
});
