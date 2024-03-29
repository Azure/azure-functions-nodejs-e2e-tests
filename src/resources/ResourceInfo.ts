// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { EnvironmentCredential } from '@azure/identity';
import { validateEnvVar } from '../utils/validateEnvVar';

export interface ResourceInfo {
    creds: EnvironmentCredential;
    subscriptionId: string;
    tenantId: string;
    clientId: string;
    secret: string;
    resourceGroupName: string;
    resourcePrefix: string;
    location: string;
}

function getResourcePrefix(): string {
    const buildNumber = validateEnvVar('BUILD_BUILDNUMBER');
    const jobAttempt = process.env['SYSTEM_JOBATTEMPT'] || '';
    const result = 'e2e' + process.platform + buildNumber + jobAttempt;
    return result.replace(/[^0-9a-zA-Z]/g, '');
}

export function getResourceInfo(): ResourceInfo {
    const tenantId = validateEnvVar('AZURE_TENANT_ID');
    const clientId = validateEnvVar('AZURE_CLIENT_ID');
    const secret = validateEnvVar('AZURE_CLIENT_SECRET');
    const subscriptionId: string = validateEnvVar('AZURE_SUBSCRIPTION_ID');
    const resourcePrefix = getResourcePrefix();

    const creds = new EnvironmentCredential();

    return {
        creds,
        tenantId,
        clientId,
        secret,
        subscriptionId,
        resourcePrefix,
        resourceGroupName: resourcePrefix + 'group',
        location: 'eastus',
    };
}
