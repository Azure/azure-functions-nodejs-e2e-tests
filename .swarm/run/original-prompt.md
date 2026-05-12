I want to fix these security findings in this repo. In addition, It would be great to identify these things - 
- Are the findings relevant and actually actionable or are they just generic surface-level suggestions which wont be relevant in a production environment?
- Are the fixes necessary?
- What was the historical context of designing the code as is? Was it intentional or a missed gap?
- Can you confirm if there will be any regressions if the fix is made? 
- Will there be a contract or a breaking change for the customer?
- How well is it tested?

## Problem

E2E test functions use `AuthorizationLevel.Anonymous` with bindings to sensitive resources, enabling unauthenticated data read/write.

## Findings (8)

| # | Vuln Type | Target Resource | Severity |
|---|-----------|----------------|----------|
| 4 | IDOR | Azure Table read via rowKey | High |
| 5 | auth-bypass | Arbitrary Service Bus messages | High |
| 6 | IDOR | SQL read via query ID | High |
| 7 | auth-bypass | Arbitrary Storage Queue messages | High |
| 8 | auth-bypass | Arbitrary Azure Table writes | High |
| 9 | IDOR | Cosmos DB document read via id | High |
| 10 | auth-bypass | Arbitrary Cosmos DB writes | Critical |
| 11 | auth-bypass | Arbitrary SQL writes | Critical |

All in `azure-functions-nodejs-e2e-tests` repo.

## Fix

~3 patterns to fix: add auth level to function.json configs, validate input parameters, restrict anonymous access.


## Raw SFI Findings

| # | SFI ID | File | Vuln | Severity | Risk | Description |
|---|--------|------|------|----------|------|-------------|
| 4 | `d1096ae5-1c50-4d89-98c5-92a79b79243e` | `app/v3/httpTriggerTableInput/function.json` | idor | High | High | IDOR and anonymous access: Azure Table entity read via rowKey |
| 5 | `10a1ab90-6025-47a9-ae0a-c8e47708588e` | `app/v3/httpTriggerServiceBusOutput/function.json` | auth-bypass | High | High | Anonymous HTTP trigger allows arbitrary Service Bus messages |
| 6 | `160dcd55-a922-4801-9321-4b31767aa202` | `app/v3/httpTriggerSqlInput/function.json` | idor | High | Medium | Anonymous SQL read via query ID (IDOR-style data access) |
| 7 | `bffed093-52a5-4c91-a88c-ca1bbe385075` | `app/v3/httpTriggerStorageQueueOutput/function.json` | auth-bypass | High | High | Anonymous HTTP trigger allows arbitrary Storage Queue messages |
| 8 | `224e6788-9a8d-47ef-8752-43b307d2d73e` | `app/v3/httpTriggerTableOutput/function.json` | auth-bypass | High | High | Anonymous HTTP trigger allows arbitrary Azure Table writes |
| 9 | `191119ab-40e3-4bae-91ff-c420d1325b90` | `app/v3/httpTriggerCosmosDBInput/function.json` | idor | High | High | IDOR and anonymous access: Cosmos DB document read via id query |
| 10 | `56cd4943-2f13-4b77-8542-939acf165c15` | `app/v3/httpTriggerCosmosDBOutput/function.json` | auth-bypass | Critical | High | Anonymous HTTP trigger allows arbitrary Cosmos DB writes |
| 11 | `3749c324-6bd2-45bf-9773-79f3af5ff791` | `app/v3/httpTriggerSqlOutput/function.json` | auth-bypass | Critical | High | Anonymous HTTP trigger allows arbitrary SQL writes |

All findings are in repo: **azure.azure-functions-nodejs-e2e-tests** (ADO: `azfunc/internal`)

### Links
- [Table input](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerTableInput/function.json)
- [ServiceBus output](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerServiceBusOutput/function.json)
- [SQL input](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerSqlInput/function.json)
- [Queue output](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerStorageQueueOutput/function.json)
- [Table output](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerTableOutput/function.json)
- [CosmosDB input](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerCosmosDBInput/function.json)
- [CosmosDB output](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerCosmosDBOutput/function.json)
- [SQL output](https://dev.azure.com/azfunc/internal/_git/azure.azure-functions-nodejs-e2e-tests?path=app/v3/httpTriggerSqlOutput/function.json)