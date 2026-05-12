# Document security posture change

- Task ID: `document-security-posture-change`
- Round: 1
- Branch: worker/task-4
- Dependencies: harden-v3-sensitive-http-triggers, harden-v4-sensitive-http-triggers

## Description

Update `README.md` (and add a focused note if needed) to explain: this repo is a localhost/emulator E2E harness; the findings are still actionable for any Azure-hosted deployment; anonymous auth was a historical convenience choice when these binding-coverage routes were added; function-level auth is a deliberate breaking change for deployed unauthenticated callers; and local Core Tools does not enforce function-key auth, so static checks and validation tests are the main regression guards. Include guidance for hosted invocation with `code` or `x-functions-key` so downstream users know the new contract.