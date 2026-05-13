# Narrow Cosmos/SQL E2Es

- Task ID: `trim-missing-id-e2es`
- Round: 1
- Branch: worker/task-2
- Dependencies: (none)

## Description

Edit `src/cosmosDB.test.ts` and `src/sql.test.ts`. Remove only the missing-`id` assertions and the temporary v3 `this.skip()` scaffolding that were added to work around them; keep the happy-path input tests, invalid output-body 400 checks, and missing-doc/missing-row 404 checks. Add a short comment or test naming that explains why the suite does not assert 400 on omitted query ids for binding-backed Cosmos/SQL input routes.