const MOVIES_PAGE_SIZE = 50;

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

const formatListItem = ({ imdbId, title, genres, releaseDate, budget }) => ({
  imdbId,
  title,
  genres: parseJsonArray(genres),
  releaseDate,
  budget: formatBudget(budget),
});

module.exports = {
  MOVIES_PAGE_SIZE,
  parseJsonArray,
  formatBudget,
  formatListItem,
};
