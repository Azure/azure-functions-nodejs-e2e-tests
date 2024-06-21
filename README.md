# Azure Functions Node.js E2E Tests

This repo contains end-to-end tests for Node.js on Azure Functions. These are automated tests designed to run regularly against prerelease versions of all the various pieces that make up the Node.js experience on Azure Functions, including:

- [Azure Functions Host](https://github.com/Azure/azure-functions-host)
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools)
- [Node.js Worker](https://github.com/Azure/azure-functions-nodejs-worker)
- [Node.js Library](https://github.com/Azure/azure-functions-nodejs-library)

## Pipeline

Here is the general flow of the pipeline:

1. Install node modules and build both the tests themselves and the test apps
2. Create several resources in Azure that will be used for testing different bindings. A unique resource prefix is generated for each individual build so that builds aren't sharing resources
3. Run the tests. A few notes:
    1. These are run in parallel by OS, but in serial by Node.js version and programming model version. Theoretically every combination could be run in parallel, but that would use a ton of Azure Pipelines agents and create a lot of Azure resources for minimal gain in time.
    2. The primary method of validation is to run core tools against the test app and validate the output
4. Delete the Azure resources
5. Upload test results

## Running locally

### Install core tools

1. Run `./scripts/install-func-cli.ps1` in PowerShell to install the latest nightly build of Azure Functions Core Tools

### Build

1. Run `npm run install` and `npm run build` in the root directory, and in the test app folders (`app/v3` and `app/v4`)

### Create resources

You need to create resources once in your subscription, but then you can reuse the same resources for many different test runs. The CI pipeline will create and delete resources each time, but you don't need to do that.

1. Set the environment variable `BUILD_BUILDNUMBER` to any number like `20230520.1`. You want it to be reasonably unique because this will be used as a prefix for your Azure resources.
2. Run `az login` and `az account set -s <subscription id>` if you're not already logged in to the [Azure CLI](https://learn.microsoft.com/cli/azure/get-started-with-azure-cli). The tests will use these credentials.
3. Run `npm run createResources`
4. Validate the resources were created. You should see a resource group in your subscription like `e2edarwin202305201group` with several resources

### Run tests

1. Run `npm run testV3` to test the v3 app, `npm run testV4` to test the v4 app, or `npm run test` to test both

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
