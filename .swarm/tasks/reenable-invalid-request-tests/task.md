# Re-enable invalid-request E2Es

- Task ID: `reenable-invalid-request-tests`
- Round: 1
- Branch: worker/task-2
- Dependencies: fix-v3-input-binding-regression, fix-v4-input-binding-regression

## Description

Once both models no longer depend on host-level query bindings, remove the temporary v3 `this.skip()` workaround and related comments from `src/cosmosDB.test.ts` and `src/sql.test.ts`; do not weaken the assertions to 500. Rebuild the root test runner and the app packages using the same flow as `azure-pipelines/templates/build-apps.yml` (`npm run build`, `npm --prefix app/v3 run build`, `npm --prefix app/v3 run lint`, `npm --prefix app/v4 run build`, `npm --prefix app/v4 run lint`, `npm run createCombinedApps`, `npm --prefix app/combined/v3-oldConfig run build`, `npm --prefix app/combined/v4-oldConfig run build`), then run `npm run testSecurityRegression`, `node out/index.js --model v3 --only cosmosDB.test.js`, `node out/index.js --model v3 --only sql.test.js`, `node out/index.js --model v4 --only cosmosDB.test.js`, `node out/index.js --model v4 --only sql.test.js`, `node out/index.js --model v3 --oldConfig --only cosmosDB.test.js`, `node out/index.js --model v4 --oldConfig --only cosmosDB.test.js`, and finish with `npm run testAllExceptServiceBus` to match the failing pipeline leg. Confirm the rerun no longer logs `Error while accessing 'id': property doesn't exist.` for `httpTriggerCosmosDBInput` or `httpTriggerSqlInput`.