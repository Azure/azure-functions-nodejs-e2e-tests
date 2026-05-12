// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpRequest, HttpResponseInit } from '@azure/functions';

interface ValidationSuccess<T> {
    value: T;
}

interface ValidationFailure {
    response: HttpResponseInit;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

type JsonRecord = Record<string, unknown>;

export function badRequest(message: string): HttpResponseInit {
    return {
        status: 400,
        jsonBody: { error: message },
    };
}

export function notFound(message: string): HttpResponseInit {
    return {
        status: 404,
        jsonBody: { error: message },
    };
}

export function getRequiredQueryParam(request: HttpRequest, name: string): ValidationResult<string> {
    const value = request.query.get(name);
    if (!isNonEmptyString(value)) {
        return { response: badRequest(`Missing or invalid query parameter \"${name}\".`) };
    }

    return { value };
}

export function getRequiredRouteParam(request: HttpRequest, name: string): ValidationResult<string> {
    const value = request.params[name];
    if (!isNonEmptyString(value)) {
        return { response: badRequest(`Missing or invalid route parameter \"${name}\".`) };
    }

    return { value };
}

export async function getRequiredJsonBody(request: HttpRequest): Promise<ValidationResult<unknown>> {
    try {
        const body = await request.json();
        if (body === undefined || body === null) {
            return { response: badRequest('Missing or invalid request body.') };
        }

        return { value: body };
    } catch {
        return { response: badRequest('Missing or invalid request body.') };
    }
}

export function validateObject(
    payload: unknown,
    isValidItem: (item: JsonRecord) => boolean,
    errorMessage: string
): HttpResponseInit | undefined {
    if (!isJsonRecord(payload) || !isValidItem(payload)) {
        return badRequest(errorMessage);
    }

    return undefined;
}

export function validateObjectOrArray(
    payload: unknown,
    isValidItem: (item: JsonRecord) => boolean,
    errorMessage: string
): HttpResponseInit | undefined {
    if (Array.isArray(payload)) {
        if (payload.length === 0) {
            return badRequest(errorMessage);
        }

        for (const item of payload) {
            if (!isJsonRecord(item) || !isValidItem(item)) {
                return badRequest(errorMessage);
            }
        }

        return undefined;
    }

    if (!isJsonRecord(payload) || !isValidItem(payload)) {
        return badRequest(errorMessage);
    }

    return undefined;
}

export function hasRequiredStringFields(item: JsonRecord, fieldNames: string[]): boolean {
    return fieldNames.every((fieldName) => isNonEmptyString(item[fieldName]));
}

export function hasDefinedField(item: JsonRecord, fieldName: string): boolean {
    return Object.prototype.hasOwnProperty.call(item, fieldName) && item[fieldName] !== undefined;
}

export function hasValidOutputEnvelope(item: JsonRecord): boolean {
    const output = item['output'];
    return isNonEmptyString(output) || (Array.isArray(output) && output.length > 0 && output.every(isNonEmptyString));
}

export function isMissingResult(value: unknown): boolean {
    return Array.isArray(value) ? value.length === 0 : value === undefined || value === null;
}

function isJsonRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}
