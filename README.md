# Azure Functions Node.js E2E Tests

This repo contains end-to-end tests for Node.js on Azure Functions. These are automated tests designed to run regularly against prerelease versions of all the various pieces that make up the Node.js experience on Azure Functions, including:

- [Azure Functions Host](https://github.com/Azure/azure-functions-host)
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools)
- [Node.js Worker](https://github.com/Azure/azure-functions-nodejs-worker)
- [Node.js Library](https://github.com/Azure/azure-functions-nodejs-library)

## Pipeline

Here is the general flow of the pipeline:

1. Install node modules and build both the tests themselves and the test apps
2. Emulate several resources in Azure that will be used for testing different bindings
3. Run the tests. A few notes:
    1. These are run in parallel by OS, but in serial by Node.js version and programming model version. Theoretically every combination could be run in parallel, but that would use a ton of Azure Pipelines agents
    2. The primary method of validation is to run core tools against the test app and validate the output
4. Shutdown the emulated Azure resources (automatic)
5. Upload test results

## Security posture for resource-backed HTTP routes

This repository is a localhost/emulator end-to-end harness. The test pipeline runs Azure Functions Core Tools on `127.0.0.1` and exercises bindings against local or emulated dependencies instead of deploying a public Azure Function App from this repo.

That operating model lowers immediate exposure in this repository, but the reported findings are still actionable for any Azure-hosted deployment of the same functions. The affected routes are wired to real Table, Cosmos DB, SQL, Storage Queue, and Service Bus bindings, so anonymous access in a hosted app can still read from or write to backing resources.

Some of those binding-coverage routes originally used anonymous auth as a historical convenience so the E2E tests could call them with simple `fetch` requests while coverage was being expanded. That was never meant to be a recommended production posture.

Sensitive resource-backed HTTP routes now require function-level auth. This is a deliberate breaking change for deployed callers that previously invoked those routes anonymously. Hosted callers must now send a function key, and should follow the tightened contract of using `GET` for read endpoints and `POST` for write endpoints.

Azure Functions Core Tools does not enforce function-key auth for local runs, so local regression protection comes primarily from static route checks and validation tests rather than from a local auth challenge.

### Hosted invocation examples

For Azure-hosted runs, include the function key either as the `code` query string parameter:

```bash
curl "https://<function-app>.azurewebsites.net/api/httpTriggerTableInput/<rowKey>?code=<function-key>"
```

or as the `x-functions-key` header:

```bash
curl   -H "x-functions-key: <function-key>"   "https://<function-app>.azurewebsites.net/api/httpTriggerTableInput/<rowKey>"
```

The same requirement applies to hosted `POST` requests for the resource-backed output routes.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
