const PAGE_SIZE = 50;

const parseJsonArray = (rawValue) => {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatBudget = (budget) =>
  `$${Number(budget || 0).toLocaleString("en-US")}`;

const createMoviesService = ({ moviesRepository, ratingsRepository }) => {
  const formatListItem = ({ imdbId, title, genres, releaseDate, budget }) => ({
    imdbId,
    title,
    genres: parseJsonArray(genres),
    releaseDate,
    budget: formatBudget(budget),
  });

  const listAllMovies = ({ page }) => {
    const pageNumber = Number(page || 1);
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      throw new Error("Query parameter 'page' must be a positive integer.");
    }

    const offset = (pageNumber - 1) * PAGE_SIZE;
    const rows = moviesRepository.listAll({ limit: PAGE_SIZE, offset });

    return {
      data: rows.map(formatListItem),
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
      },
    };
  };

  const listMoviesByYear = ({ year, page, sort }) => {
    const yearNumber = Number(year);
    if (!Number.isInteger(yearNumber) || yearNumber < 1800 || yearNumber > 3000) {
      throw new Error("Path parameter 'year' must be a valid year.");
    }

    const pageNumber = Number(page || 1);
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      throw new Error("Query parameter 'page' must be a positive integer.");
    }

    const sortDirection = String(sort || "asc").toLowerCase();
    if (sortDirection !== "asc" && sortDirection !== "desc") {
      throw new Error("Query parameter 'sort' must be 'asc' or 'desc'.");
    }

    const offset = (pageNumber - 1) * PAGE_SIZE;
    const rows = moviesRepository.listByYear({
      year: String(yearNumber),
      limit: PAGE_SIZE,
      offset,
      descending: sortDirection === "desc",
    });

    return {
      data: rows.map(formatListItem),
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
      },
    };
  };

  const getMovieDetails = ({ movieId }) => {
    const parsedMovieId = Number(movieId);
    if (!Number.isInteger(parsedMovieId) || parsedMovieId < 1) {
      throw new Error("Path parameter 'movieId' must be a positive integer.");
    }

    const movie = moviesRepository.findByMovieId({ movieId: parsedMovieId });
    if (!movie) {
      return null;
    }

    const ratingAggregate = ratingsRepository.getAverageForMovieId({
      movieId: parsedMovieId,
    });
    const averageRating = Number(ratingAggregate?.averageRating || 0);

    return {
      movieId: movie.movieId,
      imdbId: movie.imdbId,
      title: movie.title,
      description: movie.overview || "",
      releaseDate: movie.releaseDate,
      budget: formatBudget(movie.budget),
      runtime: Number(movie.runtime || 0),
      averageRating,
      genres: parseJsonArray(movie.genres),
      originalLanguage: movie.language || "",
      productionCompanies: parseJsonArray(movie.productionCompanies),
    };
  };

  return {
    listAllMovies,
    listMoviesByYear,
    getMovieDetails,
  };
};

module.exports = {
  createMoviesService,
};
