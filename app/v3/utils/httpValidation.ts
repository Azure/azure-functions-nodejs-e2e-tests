// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest } from '@azure/functions';

export function getRouteParam(request: HttpRequest, name: string): string | undefined {
    return getRequiredString(request.params?.[name]);
}

export function getQueryParam(request: HttpRequest, name: string): string | undefined {
    return getRequiredString(request.query?.[name]);
}

export function getJsonBody(request: HttpRequest): unknown {
    let body = request.body;
    if (body === undefined || body === null || body === '') {
        body = request.rawBody ?? request.bufferBody;
    }

    if (Buffer.isBuffer(body)) {
        body = body.toString();
    }

    if (typeof body === 'string') {
        const trimmedBody = body.trim();
        if (!trimmedBody) {
            return undefined;
        }

        try {
            body = JSON.parse(trimmedBody);
        } catch {
            return undefined;
        }
    }

    return body === null || body === undefined ? undefined : body;
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

export function hasRequiredStringFields(item: unknown, fieldNames: string[]): item is Record<string, unknown> {
    return isObject(item) && fieldNames.every((fieldName) => isNonEmptyString(item[fieldName]));
}

export function hasValidOutputEnvelope(body: unknown): body is { output: string | string[] } {
    return isObject(body) && isStringOrStringArray(body.output);
}

export function hasItemsWithRequiredStringFields(
    body: unknown,
    fieldNames: string[]
): body is Record<string, unknown> | Record<string, unknown>[] {
    return Array.isArray(body)
        ? body.length > 0 && body.every((item) => hasRequiredStringFields(item, fieldNames))
        : hasRequiredStringFields(body, fieldNames);
}

export function isMissingReadResult(value: unknown): boolean {
    return value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}

function getRequiredString(value: unknown): string | undefined {
    return isNonEmptyString(value) ? value.trim() : undefined;
}

function isStringOrStringArray(value: unknown): value is string | string[] {
    return isNonEmptyString(value) || (Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString));
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
