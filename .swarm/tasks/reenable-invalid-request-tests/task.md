# Re-enable invalid-request E2Es

- Task ID: `reenable-invalid-request-tests`
- Round: 1
- Branch: worker/task-2
- Dependencies: fix-v3-input-binding-regression

## Description

Once the v3 handlers own the lookup path, remove the temporary v3 skip/workaround logic from `src/cosmosDB.test.ts` and `src/sql.test.ts` so the invalid-request assertions run for both models again. Clean up the workaround comments to reflect the real contract, rebuild the root test harness, and run targeted Cosmos/SQL suites for v3 and v4 (plus a v3 old-config Cosmos spot-check after recreating combined apps) to confirm the branch no longer logs `Error while accessing 'id': property doesn't exist.` and the negative-path requests now return 400/404 as intended.