## Findings
- PR build `277790` ran source SHA `595f886` and failed only in the v3 leg. The failing host log shows `Functions.httpTriggerCosmosDBInput` and `Functions.httpTriggerSqlInput` throwing `Microsoft.Azure.WebJobs.Host: Error while accessing 'id': property doesn't exist.` immediately before the `expected 500 to equal 400` assertions.
- Main build `277740` succeeded on `main` because `main` does not include this branch's hardening changes and new invalid-request coverage. The regression is in the branch diff, not in pipeline infra.
- This branch added 400/404 handling inside the v3 Cosmos/SQL HTTP input handlers, but both `function.json` files still bind `id` from `{Query.id}` / `@id={Query.id}`. In the v3 extensions that binding is resolved before user code runs, so a missing `id` becomes a host-level 500 and the handler never gets a chance to return 400.
- Recent commits (`30b7377`, `1ee55ca`, `595f886`) tried to mask the issue with Mocha skips. The logs show the underlying host failure still exists, so the durable fix is to remove the pre-bound dependency on `id` rather than layering more skip logic.
- Table, storage, and Service Bus negative-path coverage are not implicated by the logs and should stay unchanged.

## Plan
- Replace the v3 Cosmos and SQL HTTP input bindings with handler-managed SDK lookups that validate `id` first, so missing ids return 400 and unknown ids return 404 without host exceptions. Update the v3 old-config Cosmos metadata too so combined apps do not keep the broken pre-binding.
- After the handlers own the contract, remove the temporary v3 skips in the root E2E tests and keep the invalid-request assertions enabled for both models.