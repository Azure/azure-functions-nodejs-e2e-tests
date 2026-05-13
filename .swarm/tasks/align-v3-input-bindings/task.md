# Simplify v3 input handlers

- Task ID: `align-v3-input-bindings`
- Round: 1
- Branch: worker/task-1
- Dependencies: (none)

## Description

Edit `app/v3/httpTriggerCosmosDBInput/index.ts` and `app/v3/httpTriggerSqlInput/index.ts`. Remove the unreachable missing-`id` / 400 branches added on this branch, keep the existing `function.json` input bindings in place, preserve `function` auth plus `GET`-only methods, retain the current happy-path response shapes and missing-resource 404 handling, and do not introduce SDK-based Cosmos/SQL reads or other helper sidecars.