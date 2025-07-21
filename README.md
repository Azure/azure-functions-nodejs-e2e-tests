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

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
