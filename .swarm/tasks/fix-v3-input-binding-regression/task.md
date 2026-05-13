# Replace v3 pre-bound input reads

- Task ID: `fix-v3-input-binding-regression`
- Round: 1
- Branch: worker/task-1
- Dependencies: (none)

## Description

Update `app/v3/httpTriggerCosmosDBInput/index.ts`, `app/v3/httpTriggerSqlInput/index.ts`, `app/v3/httpTriggerCosmosDBInput/function.json`, `app/v3/httpTriggerSqlInput/function.json`, and `app/v3-oldConfig/httpTriggerCosmosDBInput/function.json` so missing `id` no longer fails during binding resolution. Remove the query-bound `cosmosDB` / `sql` input bindings, validate `id` with the existing v3 helpers, then do the Cosmos and SQL reads manually using cached SDK helpers under `app/v3/utils/`. Preserve the current 200 response shapes (`testData` string for Cosmos, row array for SQL), return 400 for missing/blank ids and 404 for misses, and declare the new runtime SDK imports in `app/v3/package.json` and `app/v3/package-lock.json`.