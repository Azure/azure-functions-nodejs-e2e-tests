// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ResourceManagementClient } from '@azure/arm-resources';
import { getResourceInfo } from './ResourceInfo';

async function deleteResources(): Promise<void> {
    try {
        const info = getResourceInfo();

        const resourceClient = new ResourceManagementClient(info.creds, info.subscriptionId);
        await resourceClient.resourceGroups.beginDelete(info.resourceGroupName);
    } catch (err) {
        console.error(err);
        console.error('Delete resources failed');
        process.exit(1);
    }
}

void deleteResources();
