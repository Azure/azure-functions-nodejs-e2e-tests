// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { DefaultAzureCredential } from '@azure/identity';
import { getSubscriptionId, getUserId, getUserName } from '../utils/azureCli';
import { validateEnvVar } from '../utils/validateEnvVar';

export interface ResourceInfo {
    creds: DefaultAzureCredential;
    subscriptionId: string;
    userName: string;
    userId: string;
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
    const creds = new DefaultAzureCredential();

    const subscriptionId = await getSubscriptionId();
    const userName = await getUserName();
    const userId = await getUserId(userName);

    const resourcePrefix = getResourcePrefix();

    return {
        creds,
        subscriptionId,
        userName,
        userId,
        resourcePrefix,
        resourceGroupName: resourcePrefix + 'group',
        location: 'eastus',
    };
}
