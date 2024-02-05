// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

export async function delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

export function delaySync(ms: number): void {
    const endTime = Date.now() + ms;
    while (Date.now() < endTime) {
        // wait
    }
}
