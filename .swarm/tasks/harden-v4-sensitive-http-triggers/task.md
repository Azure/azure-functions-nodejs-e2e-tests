# Harden v4 sensitive HTTP triggers

- Task ID: `harden-v4-sensitive-http-triggers`
- Round: 1
- Branch: worker/task-2
- Dependencies: (none)

## Description

Apply the same least-privilege changes to the equivalent v4 routes in `app/v4/src/functions/httpTrigger{TableInput,ServiceBusOutput,SqlInput,StorageQueueOutput,TableOutput,CosmosDBInput,CosmosDBOutput,SqlOutput}.ts` plus the old-config overlays in `app/v4-oldConfig/src/functions/httpTriggerCosmosDB{Input,Output}.ts`. Add a shared helper under `app/v4/src/utils` for body/query/route validation and explicit 400/404 handling, set `authLevel: 'function'`, tighten methods to the minimum needed, and preserve current successful outputs so the v4 E2E behavior stays consistent.