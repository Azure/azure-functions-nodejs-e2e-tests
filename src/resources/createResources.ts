// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { ResourceManagementClient } from '@azure/arm-resources';
import { createEventHub } from './eventHub';
import { createKeyVault } from './keyVault';
import { getResourceInfo } from './ResourceInfo';
import { createSql } from './sql';
import { createStorageAccount } from './storage';

async function createResources(): Promise<void> {
    try {
        const info = await getResourceInfo();

        const resourceClient = new ResourceManagementClient(info.creds, info.subscriptionId);
        await resourceClient.resourceGroups.createOrUpdate(info.resourceGroupName, { location: info.location });

        await createKeyVault(info);

        await Promise.all([createStorageAccount(info), createEventHub(info), createSql(info)]);
    } catch (err) {
        console.error(err);
        console.error('Create resources failed');
        process.exit(1);
    }
}

void createResources();
