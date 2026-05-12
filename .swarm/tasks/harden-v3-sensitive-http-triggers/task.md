# Harden v3 sensitive HTTP triggers

- Task ID: `harden-v3-sensitive-http-triggers`
- Round: 1
- Branch: worker/task-1
- Dependencies: (none)

## Description

Update the eight flagged v3 endpoints under `app/v3/httpTrigger{TableInput,ServiceBusOutput,SqlInput,StorageQueueOutput,TableOutput,CosmosDBInput,CosmosDBOutput,SqlOutput}` and the matching legacy overlays in `app/v3-oldConfig/httpTriggerCosmosDB{Input,Output}/function.json`. Add a shared helper in `app/v3/utils` for minimal request parsing/validation, change each sensitive trigger `authLevel` from `anonymous` to `function`, reduce verbs to GET for read routes and POST for write routes, return 400 for malformed ids/bodies and 404 for missing reads, and keep the current happy-path responses/log lines stable so existing E2E assertions still pass.