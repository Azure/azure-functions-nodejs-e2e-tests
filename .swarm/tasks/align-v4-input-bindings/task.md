# Simplify v4 input handlers

- Task ID: `align-v4-input-bindings`
- Round: 1
- Branch: worker/task-3
- Dependencies: (none)

## Description

Edit `app/v4/src/functions/httpTriggerCosmosDBInput.ts`, `app/v4/src/functions/httpTriggerSqlInput.ts`, and `app/v4-oldConfig/src/functions/httpTriggerCosmosDBInput.ts`. Remove the dead `getRequiredQueryParam` / 400 branches so these handlers match Functions Host binding behavior, keep the `input.cosmosDB` / `input.sql` registrations and current auth/method settings unchanged, preserve the existing success payloads and missing-resource 404s, and avoid replacing bindings with direct SDK reads.