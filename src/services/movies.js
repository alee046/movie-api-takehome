const PAGE_SIZE = 50;

const parseGenres = (rawGenres) => {
  if (!rawGenres) {
    return [];
  }

  try {
    const parsedGenres = JSON.parse(rawGenres);
    if (!Array.isArray(parsedGenres)) {
      return [];
    }

    return parsedGenres
      .map(({ id, name }) => ({
        id: Number(id),
        name: typeof name === "string" ? name.trim() : "",
      }))
      .filter(
        ({ id, name }) => Number.isInteger(id) && name.length > 0
      );
  } catch {
    return [];
  }
};

const formatBudget = (budget) =>
  `$${Number(budget || 0).toLocaleString("en-US")}`;

const createMoviesService = ({ moviesRepository }) => {
  const listAllMovies = ({ page }) => {
    const pageNumber = Number(page || 1);
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      throw new Error("Query parameter 'page' must be a positive integer.");
    }

    const offset = (pageNumber - 1) * PAGE_SIZE;
    const rows = moviesRepository.listAll({ limit: PAGE_SIZE, offset });

    return {
      data: rows.map(({ imdbId, title, genres, releaseDate, budget }) => ({
        imdbId,
        title,
        genres: parseGenres(genres),
        releaseDate,
        budget: formatBudget(budget),
      })),
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
      },
    };
  };

  return {
    listAllMovies,
  };
};

module.exports = {
  createMoviesService,
};
