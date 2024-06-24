// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { KeyVaultManagementClient } from '@azure/arm-keyvault';
import { KeyClient, KeyVaultKey } from '@azure/keyvault-keys';
import { nonNullProp } from '../utils/nonNull';
import { ResourceInfo } from './ResourceInfo';

export async function createKeyVault(info: ResourceInfo): Promise<void> {
    const client = new KeyVaultManagementClient(info.creds, info.subscriptionId);
    await client.vaults.beginCreateOrUpdateAndWait(info.resourceGroupName, getVaultName(info), {
        location: info.location,
        properties: {
            sku: {
                family: 'A',
                name: 'standard',
            },
            tenantId: info.tenantId,
            accessPolicies: [
                {
                    objectId: info.objectId,
                    tenantId: info.tenantId,
                    permissions: {
                        secrets: ['all'],
                        keys: ['all'],
                    },
                },
            ],
        },
    });
}

export async function createSecret(info: ResourceInfo, secretName: string): Promise<string> {
    const client = getKeyClient(info);
    const response = await client.createRsaKey(secretName);
    return keyToSecret(response);
}

export async function getSecret(info: ResourceInfo, secretName: string): Promise<string> {
    const client = getKeyClient(info);
    const response = await client.getKey(secretName);
    return keyToSecret(response);
}

function getVaultName(info: ResourceInfo): string {
    return info.resourcePrefix + 'kv';
}

function getKeyClient(info: ResourceInfo): KeyClient {
    const vaultUrl = `https://${getVaultName(info)}.vault.azure.net`;
    return new KeyClient(vaultUrl, info.creds);
}

function keyToSecret(response: KeyVaultKey): string {
    return Buffer.from(nonNullProp(nonNullProp(response, 'key'), 'n'))
        .toString('base64')
        .slice(0, 64);
}
