"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatListItem = exports.formatBudget = exports.parseJsonArray = exports.MOVIES_PAGE_SIZE = void 0;
exports.MOVIES_PAGE_SIZE = 50;
const parseJsonArray = (rawValue) => {
    try {
        const parsed = JSON.parse(rawValue || "[]");
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
};
exports.parseJsonArray = parseJsonArray;
const formatBudget = (budget) => `$${(budget ?? 0).toLocaleString("en-US")}`;
exports.formatBudget = formatBudget;
const formatListItem = ({ movieId, imdbId, title, genres, releaseDate, budget }) => ({
    movieId,
    imdbId,
    title,
    genres: (0, exports.parseJsonArray)(genres),
    releaseDate,
    budget: (0, exports.formatBudget)(budget),
});
exports.formatListItem = formatListItem;
