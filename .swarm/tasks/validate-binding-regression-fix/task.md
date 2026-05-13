# Run binding regression suite

- Task ID: `validate-binding-regression-fix`
- Round: 1
- Branch: worker/task-4
- Dependencies: align-v3-input-bindings, trim-missing-id-e2es, align-v4-input-bindings

## Description

After the handler and test updates land, rebuild the repo and app variants (`npm run build`, `npm --prefix app/v3 run build`, `npm --prefix app/v3 run lint`, `npm --prefix app/v4 run build`, `npm --prefix app/v4 run lint`, `npm run createCombinedApps`, `npm --prefix app/combined/v3-oldConfig run build`, `npm --prefix app/combined/v4-oldConfig run build`). Then run `npm run testSecurityRegression`, `node out/index.js --model v3 --only cosmosDB.test.js`, `node out/index.js --model v3 --only sql.test.js`, `node out/index.js --model v4 --only cosmosDB.test.js`, `node out/index.js --model v4 --only sql.test.js`, `npm run testAllExceptServiceBus`, and `npm run testOldConfig`. Confirm the static route check stays green and the rerun no longer fails on `expected 500 to equal 400` for Cosmos/SQL missing-id cases.