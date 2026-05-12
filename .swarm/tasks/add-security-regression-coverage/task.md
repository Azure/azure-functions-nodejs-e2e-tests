# Add security regression coverage

- Task ID: `add-security-regression-coverage`
- Round: 1
- Branch: worker/task-3
- Dependencies: harden-v3-sensitive-http-triggers, harden-v4-sensitive-http-triggers

## Description

Update `src/{storage,serviceBus,cosmosDB,sql}.test.ts` and any shared helpers to cover both happy paths and negative cases for the hardened endpoints: malformed payloads, missing ids, and not-found reads should now produce deterministic 400/404 responses. Send explicit JSON content types in HTTP write tests. Add a repo-level regression script/test (for example under `scripts/`) that inspects the sensitive v3/v4/oldConfig routes and fails if auth drifts back to anonymous or methods broaden again. If useful, extend `src/constants.ts` or a helper so hosted runs can append a function key from env without changing current local URLs. Validate with the existing v3/v4/oldConfig test suites plus the new static guard.