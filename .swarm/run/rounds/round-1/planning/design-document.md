## Repo map
- `src/*.test.ts` is the E2E harness. `src/global.test.ts` starts `app/v3` or `app/v4`; `--oldConfig` runs generated `app/combined/<model>-oldConfig`.
- `app/v3` and `app/v4` are separate npm apps with their own package manifests. Any new runtime SDK code must be added there, not just at repo root.
- `app/*-oldConfig` are overlays that get copied on top of the base app during `npm run createCombinedApps`. For this bug, only Cosmos has oldConfig input readers; there is no oldConfig SQL reader.

## Investigation summary
1. This is a code bug on the branch, not pipeline infra. Bad build `277790` finishes the v3 leg with skipped invalid-request tests from `30b7377`, `1ee55ca`, and `595f886`, then the v4 leg fails two assertions with `expected 500 to equal 400`.
2. The failing log lines are `Functions.httpTriggerCosmosDBInput` and `Functions.httpTriggerSqlInput`: `Microsoft.Azure.WebJobs.Host: Error while accessing 'id': property doesn't exist.` Both invocations fail in ~2–5 ms, which is too early for handler validation to rescue them.
3. Commit history explains the confusion: `e25f67b` / `7cabe80` added auth/method hardening and in-handler 400/404 validation; `513a40c` added missing-id E2Es; the later “fix” commits only adjusted the v3 skip logic and never removed the v4 pre-bound read path.
4. `main` build `277740` passes because it only exercises happy-path Cosmos/SQL reads. Main still uses the same `Query.id`-based bindings, so the branch exposed a latent bug rather than introducing a brand-new runtime behavior.

## Root cause
- Think of the binding declaration as code the Functions host runs before your handler. In v3 that is the `function.json` input binding; in v4 it is `input.cosmosDB(...)` / `input.sql(...)`.
- Those bindings still reference `{Query.id}` / `@id={Query.id}`. When `id` is missing, the host throws a 500 while materializing the input binding, so our 400/404 handler code is effectively dead code.
- `npm run testSecurityRegression` stays green because it only checks auth level and HTTP methods, not runtime missing-id behavior.

## Fix strategy
- Move Cosmos/SQL reads into handler-owned SDK helpers that use `process.env.CosmosDBConnection` / `process.env.SqlConnection` (already written by `src/global.test.ts`), validate `id` first, then do the lookup.
- Remove the `Query.id`-based input bindings from v3, v4, and the Cosmos oldConfig overlays so combined apps cannot reintroduce the failure.
- After both models own the read path, remove the temporary v3 skips and rerun the same non-Service Bus pipeline leg plus oldConfig Cosmos checks.