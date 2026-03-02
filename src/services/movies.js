const {
  MOVIES_PAGE_SIZE,
  parseJsonArray,
  formatBudget,
  formatListItem,
} = require("../utils");

const createMoviesService = ({ moviesRepository, ratingsRepository }) => {
  const listAllMovies = ({ page }) => {
    const pageNumber = Number(page || 1);

    const offset = (pageNumber - 1) * MOVIES_PAGE_SIZE;
    const rows = moviesRepository.listAll({ limit: MOVIES_PAGE_SIZE, offset });

    return {
      data: rows.map(formatListItem),
      pagination: {
        page: pageNumber,
        pageSize: MOVIES_PAGE_SIZE,
      },
    };
  };

  const listMoviesByYear = ({ year, page, sort }) => {
    const yearValue = String(year);
    const pageNumber = Number(page || 1);
    const sortDirection = String(sort || "asc").toLowerCase();

    const offset = (pageNumber - 1) * MOVIES_PAGE_SIZE;
    const rows = moviesRepository.listByYear({
      year: yearValue,
      limit: MOVIES_PAGE_SIZE,
      offset,
      descending: sortDirection === "desc",
    });

    return {
      data: rows.map(formatListItem),
      pagination: {
        page: pageNumber,
        pageSize: MOVIES_PAGE_SIZE,
      },
    };
  };

  const listMoviesByGenre = ({ genre, page }) => {
    const normalizedGenre = String(genre);
    const pageNumber = Number(page || 1);

    const offset = (pageNumber - 1) * MOVIES_PAGE_SIZE;
    const rows = moviesRepository.listByGenre({
      genre: normalizedGenre,
      limit: MOVIES_PAGE_SIZE,
      offset,
    });

    return {
      data: rows.map(formatListItem),
      pagination: {
        page: pageNumber,
        pageSize: MOVIES_PAGE_SIZE,
      },
    };
  };

  const getMovieDetails = ({ movieId }) => {
    const parsedMovieId = Number(movieId);

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
    listMoviesByGenre,
    getMovieDetails,
  };
};

module.exports = {
  createMoviesService,
};
