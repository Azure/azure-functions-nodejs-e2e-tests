# Replace v4 pre-bound input reads

- Task ID: `fix-v4-input-binding-regression`
- Round: 1
- Branch: worker/task-3
- Dependencies: (none)

## Description

Update `app/v4/src/functions/httpTriggerCosmosDBInput.ts`, `app/v4/src/functions/httpTriggerSqlInput.ts`, and `app/v4-oldConfig/src/functions/httpTriggerCosmosDBInput.ts` so handler validation runs before any data lookup. Remove the `input.cosmosDB` / `input.sql` extraInputs that depend on `{Query.id}` / `@id={Query.id}`, add cached Cosmos/SQL helper(s) under `app/v4/src/utils/` and `app/v4-oldConfig/src/utils/`, and perform the manual reads only after `getRequiredQueryParam` succeeds. Keep the current success payloads, return `badRequest(...)` / `notFound(...)` for missing and unknown ids, and update `app/v4/package.json` for the new runtime dependencies.