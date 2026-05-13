## Repo map
- `src/*.test.ts` drives Core Tools against `app/v3`, `app/v4`, and `app/combined/*-oldConfig` from `src/global.test.ts`.
- Cosmos/SQL read coverage still comes from real Functions input bindings: v3 via `app/v3/*/function.json`, v4 via `input.cosmosDB()` / `input.sql()`. `v3-oldConfig` reuses the base v3 handler code; only `v4-oldConfig` has its own TS handler copy.
- `scripts/check-sensitive-http-routes.js` already enforces the auth/method hardening independently of the runtime E2Es.

## Findings
1. The bad branch failures are caused by the new missing-`id` assertions added in `513a40c`; bad run `277790` shows `Error while accessing 'id': property doesn't exist.` for `httpTriggerCosmosDBInput` and `httpTriggerSqlInput` before handler code runs.
2. `main` succeeds because it only covers happy-path Cosmos/SQL reads. The branch added handler-level 400/404 logic, but the underlying query-bound input bindings still execute first in both v3 and v4.
3. This repo is an internal end-to-end harness for host/Core Tools/worker/library integration. Replacing input bindings with direct SDK reads would make the failures disappear, but it would also stop exercising the real Cosmos/SQL input-binding path that this suite is supposed to validate.

## Decision
- Keep the Functions Host input bindings in place and keep the auth/method hardening from this branch.
- Roll back only the impossible missing-`id` 400 expectation for Cosmos/SQL input routes, plus the dead handler branches that claim to support it.
- Keep coverage that still reflects real handler-owned behavior: happy-path reads, invalid output payload 400s, and missing-resource 404s after a successful binding lookup.

## Validation
- Rebuild both models and the combined oldConfig apps.
- Run `npm run testSecurityRegression`, targeted Cosmos/SQL suites for v3 and v4, then `npm run testAllExceptServiceBus` and `npm run testOldConfig` to confirm the branch matches `main` for binding semantics while retaining the new security hardening.