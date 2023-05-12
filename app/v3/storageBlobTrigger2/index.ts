// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const blobTrigger: AzureFunction = async function (_context: Context, myBlob: any): Promise<void> {
    console.log(`storageBlobTrigger2 was triggered by "${myBlob.toString()}"`);
};

export default blobTrigger;
