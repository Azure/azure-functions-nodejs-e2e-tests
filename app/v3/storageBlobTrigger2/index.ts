// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<void> {
    const blobPath = context.bindingData.blobTrigger;
    context.log(`storageBlobTrigger2 was triggered by blob "${blobPath}" with content "${myBlob.toString()}"`);
};

export default blobTrigger;
