# Replace v3 pre-bound input reads

- Task ID: `fix-v3-input-binding-regression`
- Round: 1
- Branch: worker/task-1
- Dependencies: (none)

## Description

Update `app/v3/httpTriggerCosmosDBInput/index.ts`, `app/v3/httpTriggerSqlInput/index.ts`, `app/v3/httpTriggerCosmosDBInput/function.json`, `app/v3/httpTriggerSqlInput/function.json`, and `app/v3-oldConfig/httpTriggerCosmosDBInput/function.json`. Remove the Cosmos/SQL input bindings that read `Query.id` before user code, then keep the current 400/404/200 contract by validating `id` first and doing the Cosmos/SQL lookups in new cached helpers under `app/v3/utils/` (reuse the connection-string names already written by `src/global.test.ts`, but do not import test-only helpers from root `src/`). Preserve the existing success payloads (`testData` string for Cosmos, row-array JSON for SQL), and add the runtime SDK dependencies plus lockfile updates in `app/v3/package.json` and `app/v3/package-lock.json`.