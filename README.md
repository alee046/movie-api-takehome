  Notes/Decisions
  
  1. Commits are organized by task/feature to make review and rollback easier.
  2. Used a routes -> services -> repositories structure for separation of concerns and unit-
     testable services.
  3. Configuration is environment-driven via .env files for local/dev setup.
  4. Added integration tests per user story, with assertions mapped to ACs.
  5. Added Zod for query/param validation at the route layer to keep validation consistent and
     concise.
