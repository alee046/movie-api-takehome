import Database from "better-sqlite3";

type CreateDbRuntimeInput = {
  moviesDbPath: string;
  ratingsDbPath: string;
};

export const createDbRuntime = ({ moviesDbPath, ratingsDbPath }: CreateDbRuntimeInput) => {
  const moviesDb = new Database(moviesDbPath, { readonly: true });
  const ratingsDb = new Database(ratingsDbPath, { readonly: true });

  return {
    moviesDb,
    ratingsDb,
    close: () => {
      moviesDb.close();
      ratingsDb.close();
    },
  };
};
