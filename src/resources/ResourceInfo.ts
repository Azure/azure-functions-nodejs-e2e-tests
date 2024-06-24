// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureCliCredential } from '@azure/identity';
import { getObjectId, getSubscriptionId, getTenantId, getUserName } from '../utils/azureCli';
import { validateEnvVar } from '../utils/validateEnvVar';

export interface ResourceInfo {
    creds: AzureCliCredential;
    subscriptionId: string;
    tenantId: string;
    userName: string;
    objectId: string;
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

export async function getResourceInfo(): Promise<ResourceInfo> {
    // NOTE: Using `AzureCliCredential` instead of `DefaultAzureCredential` to avoid "InvalidAuthenticationTokenTenant" error on 1es build agents
    // These creds automatically handle `additionallyAllowedTenantIds` for us, while not all other creds do
    const creds = new AzureCliCredential();

    const subscriptionId = await getSubscriptionId();
    const tenantId = await getTenantId();
    const userName = await getUserName();
    const objectId = await getObjectId(userName);

    const resourcePrefix = getResourcePrefix();

    return {
        creds,
        subscriptionId,
        tenantId,
        userName,
        objectId,
        resourcePrefix,
        resourceGroupName: resourcePrefix + 'group',
        location: 'eastus',
    };
}
