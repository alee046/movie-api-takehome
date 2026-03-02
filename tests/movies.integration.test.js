const request = require("supertest");

const { createAppRuntime } = require("../src/app");

test("GET /movies returns first page with required columns", async () => {
  const { app, close } = createAppRuntime();

  try {
    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.pageSize).toBe(50);
    expect(response.body.data.length).toBe(50);

    const firstMovie = response.body.data[0];
    expect(Object.keys(firstMovie)).toEqual([
      "imdbId",
      "title",
      "genres",
      "releaseDate",
      "budget",
    ]);
    expect(firstMovie.budget).toMatch(/^\$[\d,]+$/);
    expect(Array.isArray(firstMovie.genres)).toBe(true);
    expect(firstMovie.genres.length).toBeGreaterThan(0);
    expect(firstMovie.genres[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      })
    );
  } finally {
    close();
  }
});

test("GET /movies?page=2 returns second page", async () => {
  const { app, close } = createAppRuntime();

  try {
    const page1 = await request(app).get("/movies?page=1");
    const page2 = await request(app).get("/movies?page=2");

    expect(page2.status).toBe(200);
    expect(page2.body.pagination.page).toBe(2);
    expect(page2.body.pagination.pageSize).toBe(50);
    expect(page2.body.data.length).toBe(50);
    expect(page1.body.data[0].imdbId).not.toBe(page2.body.data[0].imdbId);
  } finally {
    close();
  }
});

test("GET /movies/:movieId returns required movie details columns", async () => {
  const { app, close } = createAppRuntime();

  try {
    const response = await request(app).get("/movies/11");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
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
      })
    );

    expect(response.body.genres[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      })
    );
    expect(response.body.productionCompanies[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      })
    );
  } finally {
    close();
  }
});

test("GET /movies/:movieId uses ratings from ratings database", async () => {
  const { app, close } = createAppRuntime();

  try {
    const response = await request(app).get("/movies/11");

    expect(response.status).toBe(200);
    expect(response.body.averageRating).toBeCloseTo(3.689, 3);
  } finally {
    close();
  }
});
