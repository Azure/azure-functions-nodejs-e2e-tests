// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<any> {
    const blobPath = context.bindingData.blobTrigger;
    context.log(`storageBlobTrigger1 was triggered by blob "${blobPath}" with content "${myBlob.toString()}"`);
    return myBlob;
};

export default blobTrigger;
