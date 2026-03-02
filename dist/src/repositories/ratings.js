"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRatingsRepository = void 0;
const createRatingsRepository = ({ ratingsDb }) => {
    const averageRatingStatement = ratingsDb.prepare("SELECT AVG(rating) AS averageRating FROM ratings WHERE movieId = ?");
    return {
        getAverageForMovieId: ({ movieId }) => averageRatingStatement.get(movieId) ?? null,
    };
};
exports.createRatingsRepository = createRatingsRepository;
