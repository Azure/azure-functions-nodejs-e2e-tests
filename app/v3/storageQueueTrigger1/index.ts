import { AzureFunction, Context } from "@azure/functions";

const queueTrigger: AzureFunction = async function (context: Context, myQueueItem: string): Promise<string> {
    context.log(`storageQueueTrigger1 was triggered by "${myQueueItem}"`);
    return myQueueItem;
};

export default queueTrigger;
