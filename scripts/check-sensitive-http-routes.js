#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const routeExpectations = [
    { kind: 'json', path: 'app/v3/httpTriggerTableInput/function.json', authLevel: 'function', methods: ['get'] },
    { kind: 'json', path: 'app/v3/httpTriggerTableOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'json', path: 'app/v3/httpTriggerServiceBusOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'json', path: 'app/v3/httpTriggerStorageQueueOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'json', path: 'app/v3/httpTriggerCosmosDBInput/function.json', authLevel: 'function', methods: ['get'] },
    { kind: 'json', path: 'app/v3/httpTriggerCosmosDBOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'json', path: 'app/v3/httpTriggerSqlInput/function.json', authLevel: 'function', methods: ['get'] },
    { kind: 'json', path: 'app/v3/httpTriggerSqlOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'json', path: 'app/v3-oldConfig/httpTriggerCosmosDBInput/function.json', authLevel: 'function', methods: ['get'] },
    { kind: 'json', path: 'app/v3-oldConfig/httpTriggerCosmosDBOutput/function.json', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerTableInput.ts', authLevel: 'function', methods: ['get'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerTableOutput.ts', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerServiceBusOutput.ts', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerStorageQueueOutput.ts', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerCosmosDBInput.ts', authLevel: 'function', methods: ['get'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerCosmosDBOutput.ts', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerSqlInput.ts', authLevel: 'function', methods: ['get'] },
    { kind: 'ts', path: 'app/v4/src/functions/httpTriggerSqlOutput.ts', authLevel: 'function', methods: ['post'] },
    { kind: 'ts', path: 'app/v4-oldConfig/src/functions/httpTriggerCosmosDBInput.ts', authLevel: 'function', methods: ['get'] },
    { kind: 'ts', path: 'app/v4-oldConfig/src/functions/httpTriggerCosmosDBOutput.ts', authLevel: 'function', methods: ['post'] },
];

const failures = [];
for (const expectation of routeExpectations) {
    const filePath = path.join(repoRoot, expectation.path);
    try {
        if (expectation.kind === 'json') {
            validateJsonRoute(filePath, expectation);
        } else {
            validateTsRoute(filePath, expectation);
        }
    } catch (error) {
        failures.push(`${expectation.path}: ${error.message}`);
    }
}

if (failures.length > 0) {
    console.error('Sensitive HTTP route regression check failed:');
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(`Sensitive HTTP route regression check passed for ${routeExpectations.length} files.`);

function validateJsonRoute(filePath, expectation) {
    const source = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(source);
    const httpTrigger = config.bindings.find((binding) => binding.type === 'httpTrigger');
    if (!httpTrigger) {
        throw new Error('Missing httpTrigger binding.');
    }

    assertEqual(filePath, 'authLevel', normalizeString(httpTrigger.authLevel), expectation.authLevel);
    assertMethods(filePath, normalizeMethods(httpTrigger.methods), expectation.methods);
}

function validateTsRoute(filePath, expectation) {
    const source = fs.readFileSync(filePath, 'utf8');
    const authLevelMatch = source.match(/authLevel:\s*['"`]([^'"`]+)['"`]/);
    const methodsMatch = source.match(/methods:\s*\[([^\]]*)\]/);

    if (!authLevelMatch) {
        throw new Error('Missing authLevel declaration.');
    }
    if (!methodsMatch) {
        throw new Error('Missing methods declaration.');
    }

    const methods = Array.from(methodsMatch[1].matchAll(/['"`]([^'"`]+)['"`]/g)).map((match) => normalizeString(match[1]));
    assertEqual(filePath, 'authLevel', normalizeString(authLevelMatch[1]), expectation.authLevel);
    assertMethods(filePath, methods, expectation.methods);
}

function assertEqual(filePath, label, actual, expected) {
    if (actual !== expected) {
        throw new Error(`Expected ${label} "${expected}" but found "${actual}" in ${path.relative(repoRoot, filePath)}.`);
    }
}

function assertMethods(filePath, actual, expected) {
    const actualSet = new Set(actual);
    const expectedSet = new Set(expected);
    if (actualSet.size !== expectedSet.size || [...expectedSet].some((method) => !actualSet.has(method))) {
        throw new Error(
            `Expected methods [${expected.join(', ')}] but found [${actual.join(', ')}] in ${path.relative(
                repoRoot,
                filePath
            )}.`
        );
    }
}

function normalizeMethods(methods) {
    if (!Array.isArray(methods)) {
        return [];
    }

    return methods.map(normalizeString);
}

function normalizeString(value) {
    return String(value).trim().toLowerCase();
}
