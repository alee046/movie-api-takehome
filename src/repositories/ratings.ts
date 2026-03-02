import Database from "better-sqlite3";

type CreateRatingsRepositoryInput = {
  ratingsDb: Database.Database;
};

type AverageRatingRow = {
  averageRating: number | null;
};

export const createRatingsRepository = ({ ratingsDb }: CreateRatingsRepositoryInput) => {
  const averageRatingStatement = ratingsDb.prepare<[number], AverageRatingRow>(
    "SELECT AVG(rating) AS averageRating FROM ratings WHERE movieId = ?"
  );

  return {
    getAverageForMovieId: ({ movieId }: { movieId: number }) =>
      averageRatingStatement.get(movieId) ?? null,
  };
};
