## Context / assessment
- The reported findings are not generic scanner noise: each flagged route is an HTTP trigger directly wired to Table, Cosmos DB, SQL, Storage Queue, or Service Bus bindings. In any Azure-hosted or shared environment, anonymous callers can read or write real backing resources.
- The repo’s current operating model lowers immediate exploitability: `README.md`, `src/global.test.ts`, and the pipeline show a localhost-only E2E harness (`func start` on `127.0.0.1` plus storage/Cosmos/Service Bus/SQL emulators). There is no in-repo deployment flow to a public Azure Function App.
- The fixes are still necessary. These are true-positive patterns on sensitive bindings, and equivalent v4/oldConfig endpoints use the same anonymous design even though the SFI report only enumerated v3 files.
- This is primarily an auth/IDOR problem, not SQL injection: the SQL input binding already uses a parameterized query. Validation is defense in depth; requiring auth and reducing surface area are the primary controls.

## Historical context
- Git history shows these endpoints were introduced to expand binding coverage and keep the E2E harness simple (`cosmos db test`, `Add extra output tests for storage/serviceBus (#12)`, `Add table input/output test (#16)`, `Emulate Storage and CosmosDB E2E Tests (#62)`).
- Anonymous auth appears to have been an intentional convenience choice for fetch-based tests, not a production threat model. There is no evidence of later hardening or auth-focused regression tests.

## Planned change shape
1. Harden only the resource-backed HTTP routes in v3, v4, and oldConfig equivalents; leave non-sensitive anonymous routes (hello world, headers, query, cookies, etc.) unchanged.
2. Change auth from `anonymous` to `function` and narrow HTTP verbs to least privilege: GET for read endpoints, POST for write endpoints.
3. Add minimal guard clauses instead of overly strict schemas:
   - reject missing or malformed `rowKey`/`id`/request bodies with 400,
   - return 404 when a lookup resolves to no resource,
   - validate required payload fields before queue/table/cosmos/sql writes,
   - preserve current happy-path payloads, status codes, and log messages.
4. Add static regression coverage that inspects sensitive route definitions so auth cannot drift back to anonymous or broader methods, because local Core Tools does not enforce function-key auth.
5. Document the hosted-call contract (`code` query string or `x-functions-key`) and, if practical, let test helpers append an env-supplied key for future hosted runs without changing local behavior.

## Regressions / breaking change
- Local CI should not regress from the auth-level change alone because Azure Functions Core Tools disables HTTP auth enforcement when running locally. The main behavioral regression risk is the new request validation, so negative-path tests are needed.
- Any deployed consumer calling these endpoints anonymously will see a deliberate breaking change and must send a function key. Tightening verbs can also break callers that currently use POST for reads or GET for writes.
- Because this repo is an E2E harness rather than a customer-facing service, production impact is limited, but the contract change should still be documented clearly.

## Test state
- Existing happy-path E2E coverage is good: `src/storage.test.ts`, `src/serviceBus.test.ts`, `src/cosmosDB.test.ts`, and `src/sql.test.ts` exercise the flagged flows across v3/v4, and combined oldConfig runs cover the legacy Cosmos paths.
- Coverage is weak for security regression: there are no auth-focused checks, no malformed-input coverage for these endpoints, and no static assertions on auth level or HTTP methods.
- We cannot fully prove Azure-hosted auth enforcement inside the current emulator-only suite, so the plan adds static config guards plus E2E validation tests for 400/404 behavior.