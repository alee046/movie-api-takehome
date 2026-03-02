const Database = require("better-sqlite3");

const createDbRuntime = ({ moviesDbPath, ratingsDbPath }) => {
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

module.exports = {
  createDbRuntime,
};
