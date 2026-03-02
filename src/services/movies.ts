import {
  MOVIES_PAGE_SIZE,
  parseJsonArray,
  formatBudget,
  formatListItem,
} from "../utils";

export type NamedEntity = {
  id: number;
  name: string;
};

export type MovieListItem = {
  movieId: number;
  imdbId: string;
  title: string;
  genres: NamedEntity[];
  releaseDate: string | null;
  budget: string;
};

export type PaginatedMovieList = {
  data: MovieListItem[];
  pagination: {
    page: number;
    pageSize: number;
  };
};

export type MovieDetails = {
  movieId: number;
  imdbId: string;
  title: string;
  description: string;
  releaseDate: string | null;
  budget: string;
  runtime: number;
  averageRating: number;
  genres: NamedEntity[];
  originalLanguage: string;
  productionCompanies: NamedEntity[];
};

export type MoviesService = {
  listAllMovies: (args: { page?: number }) => PaginatedMovieList;
  listMoviesByYear: (args: { year: string; page?: number; sort?: "asc" | "desc" }) => PaginatedMovieList;
  listMoviesByGenre: (args: { genre: string; page?: number }) => PaginatedMovieList;
  getMovieDetails: (args: { movieId: number }) => MovieDetails | null;
};

type MoviesRepository = {
  listAll: (args: { limit: number; offset: number }) => Array<{
    movieId: number;
    imdbId: string;
    title: string;
    genres: string | null;
    releaseDate: string | null;
    budget: number | null;
  }>;
  listByYear: (args: {
    year: string;
    limit: number;
    offset: number;
    descending: boolean;
  }) => Array<{
    movieId: number;
    imdbId: string;
    title: string;
    genres: string | null;
    releaseDate: string | null;
    budget: number | null;
  }>;
  listByGenre: (args: {
    genre: string;
    limit: number;
    offset: number;
  }) => Array<{
    movieId: number;
    imdbId: string;
    title: string;
    genres: string | null;
    releaseDate: string | null;
    budget: number | null;
  }>;
  findByMovieId: (args: { movieId: number }) =>
    | {
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
      }
    | null;
};

type RatingsRepository = {
  getAverageForMovieId: (args: { movieId: number }) => {
    averageRating: number | null;
  } | null;
};

export const createMoviesService = ({
  moviesRepository,
  ratingsRepository,
}: {
  moviesRepository: MoviesRepository;
  ratingsRepository: RatingsRepository;
}): MoviesService => {
  const listAllMovies = ({ page }: { page?: number }) => {
    const pageNumber = page ?? 1;

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

  const listMoviesByYear = ({
    year,
    page,
    sort,
  }: {
    year: string;
    page?: number;
    sort?: "asc" | "desc";
  }) => {
    const pageNumber = page ?? 1;
    const sortDirection = sort ?? "asc";

    const offset = (pageNumber - 1) * MOVIES_PAGE_SIZE;
    const rows = moviesRepository.listByYear({
      year,
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

  const listMoviesByGenre = ({ genre, page }: { genre: string; page?: number }) => {
    const pageNumber = page ?? 1;

    const offset = (pageNumber - 1) * MOVIES_PAGE_SIZE;
    const rows = moviesRepository.listByGenre({
      genre,
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

  const getMovieDetails = ({ movieId }: { movieId: number }) => {
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
      budget: formatBudget(movie.budget),
      runtime: movie.runtime ?? 0,
      averageRating,
      genres: parseJsonArray<NamedEntity>(movie.genres),
      originalLanguage: movie.language || "",
      productionCompanies: parseJsonArray<NamedEntity>(movie.productionCompanies),
    };
  };

  return {
    listAllMovies,
    listMoviesByYear,
    listMoviesByGenre,
    getMovieDetails,
  };
};
