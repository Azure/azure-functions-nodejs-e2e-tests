# Replace v3 pre-bound input reads

- Task ID: `fix-v3-input-binding-regression`
- Round: 1
- Branch: worker/task-1
- Dependencies: (none)

## Description

In `app/v3/httpTriggerCosmosDBInput` and `app/v3/httpTriggerSqlInput`, stop relying on the current `cosmosDB` / `sql` input bindings that resolve `{Query.id}` before the handler executes. Remove those pre-bound input definitions from `app/v3/httpTriggerCosmosDBInput/function.json`, `app/v3/httpTriggerSqlInput/function.json`, and `app/v3-oldConfig/httpTriggerCosmosDBInput/function.json`; then perform the Cosmos and SQL reads manually in the handlers after validating the query param with the existing v3 validation helpers. Add any small shared client/pool helper under `app/v3/utils/`, update `app/v3/package.json` and `app/v3/package-lock.json` for the required runtime SDKs, preserve the existing success payloads (Cosmos returns `testData`, SQL returns the row array), and make missing/blank ids return 400 while unknown ids return 404 instead of a host 500.