// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { AzureFunction, Context } from '@azure/functions';

const blobTrigger: AzureFunction = async function (_context: Context, myBlob: any): Promise<any> {
    console.log(`storageBlobTrigger1 was triggered by "${myBlob.toString()}"`);
    return myBlob;
};

export default blobTrigger;
