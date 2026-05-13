# Re-enable invalid-request E2Es

- Task ID: `reenable-invalid-request-tests`
- Round: 1
- Branch: worker/task-2
- Dependencies: fix-v3-input-binding-regression, fix-v4-input-binding-regression

## Description

Once both model implementations no longer rely on host-level query bindings, remove the temporary v3 `this.skip()` workaround and stale comments from `src/cosmosDB.test.ts` and `src/sql.test.ts`. Keep the invalid-request expectations at 400/404 (do not change them to 500), run `npm run build`, `npm run testSecurityRegression`, targeted `node out/index.js --model v3 --only cosmosDB.test.js`, `node out/index.js --model v3 --only sql.test.js`, `node out/index.js --model v4 --only cosmosDB.test.js`, `node out/index.js --model v4 --only sql.test.js`, then `npm run createCombinedApps` plus `node out/index.js --model v3 --oldConfig --only cosmosDB.test.js` and `node out/index.js --model v4 --oldConfig --only cosmosDB.test.js` to confirm the host-level `Error while accessing 'id': property doesn't exist.` is gone.