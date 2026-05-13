# Replace v4 pre-bound input reads

- Task ID: `fix-v4-input-binding-regression`
- Round: 1
- Branch: worker/task-3
- Dependencies: (none)

## Description

Update `app/v4/src/functions/httpTriggerCosmosDBInput.ts` and `app/v4/src/functions/httpTriggerSqlInput.ts` so `getRequiredQueryParam` runs before any data fetch. Remove the `input.cosmosDB(...)` / `input.sql(...)` declarations that embed `{Query.id}` / `@id={Query.id}`, replace them with manual Cosmos/SQL reads through cached helpers under `app/v4/src/utils/`, and mirror the Cosmos fix in `app/v4-oldConfig/src/functions/httpTriggerCosmosDBInput.ts` (there is no oldConfig SQL reader). If the oldConfig source needs its own wrapper/helper under `app/v4-oldConfig/src/utils/` to keep imports self-contained after `createCombinedApps`, add it. Keep auth/method settings unchanged, preserve the current success payloads, return `badRequest(...)` for missing ids and `notFound(...)` for misses, and update `app/v4/package.json` / `app/v4/package-lock.json` for the runtime SDK dependencies.