import { AzureFunction, Context } from "@azure/functions";

const queueTrigger: AzureFunction = async function (context: Context, myQueueItem: string): Promise<void> {
    context.log(`storageQueueTrigger2 was triggered by "${myQueueItem}"`);
};

export default queueTrigger;
