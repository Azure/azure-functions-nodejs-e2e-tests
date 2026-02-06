// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

/**
 * This sample demonstrates the correct way to stream JSON responses using Node.js Readable streams.
 *
 * Issue: When using @azure/functions@4.11.1+, the HttpResponseBodyInit type no longer accepts
 * Node.js Readable streams directly. You must convert them to Web ReadableStream.
 *
 * Error customers may see:
 *   error TS2322: Type 'Readable' is not assignable to type 'HttpResponseBodyInit'.
 *   Type 'Readable' is missing the following properties from type 'FormData': append, set, get, getAll, and 7 more.
 *
 * Solution: Use `Readable.toWeb(stream)` to convert Node.js Readable to Web ReadableStream.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Readable } from 'stream';

interface DataItem {
    id: number;
    name: string;
    timestamp: string;
}

/**
 * Creates a Node.js Readable stream that emits JSON array items.
 * This simulates a common pattern where data is streamed from a database or API.
 */
function createJsonStream(itemCount: number): Readable {
    let currentItem = 0;
    let isFirstItem = true;

    const stream = new Readable({
        read() {
            if (currentItem === 0) {
                // Start JSON array
                this.push('[');
            }

            if (currentItem < itemCount) {
                const item: DataItem = {
                    id: currentItem + 1,
                    name: `Item ${currentItem + 1}`,
                    timestamp: new Date().toISOString(),
                };

                const prefix = isFirstItem ? '' : ',';
                isFirstItem = false;
                this.push(prefix + JSON.stringify(item));
                currentItem++;
            } else {
                // End JSON array and signal end of stream
                this.push(']');
                this.push(null);
            }
        },
    });

    return stream;
}

export async function httpTriggerStreamJsonResponse(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const itemCountParam = request.query.get('itemCount');
    const itemCount = itemCountParam ? parseInt(itemCountParam, 10) : 10;

    // Create a Node.js Readable stream
    const jsonStream: Readable = createJsonStream(itemCount);

    // IMPORTANT: Convert Node.js Readable to Web ReadableStream
    // This is required because HttpResponseBodyInit expects Web ReadableStream, not Node.js Readable.
    // Without this conversion, you'll get:
    //   error TS2322: Type 'Readable' is not assignable to type 'HttpResponseBodyInit'.
    //
    // Note: The 'as any' cast is needed due to slight type differences between Node.js and
    // Web API ReadableStream types. This is safe as Readable.toWeb() produces a valid web stream.
    const webStream = Readable.toWeb(jsonStream) as any;

    return {
        body: webStream,
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

app.http('httpTriggerStreamJsonResponse', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: httpTriggerStreamJsonResponse,
});
