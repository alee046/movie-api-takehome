export const MOVIES_PAGE_SIZE = 50;

export const parseJsonArray = <T>(rawValue?: string | null): T[] => {
  try {
    const parsed: unknown = JSON.parse(rawValue || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const formatBudget = (budget: number | null | undefined) =>
  `$${(budget ?? 0).toLocaleString("en-US")}`;

type NamedEntity = {
  id: number;
  name: string;
};

type ListItemInput = {
  movieId: number;
  imdbId: string;
  title: string;
  genres: string | null;
  releaseDate: string | null;
  budget: number | null;
};

export const formatListItem = ({ movieId, imdbId, title, genres, releaseDate, budget }: ListItemInput) => ({
  movieId,
  imdbId,
  title,
  genres: parseJsonArray<NamedEntity>(genres),
  releaseDate,
  budget: formatBudget(budget),
});
