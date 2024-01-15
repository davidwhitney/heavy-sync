import { Options } from "./types";
import { app, HttpRequest, HttpResponseInit, InvocationContext, Timer } from "@azure/functions";
import { main, container } from ".";
import { InMemoryOutputWriter } from "./output-generation/InMemoryOutputWriter";

container.reregister("IOutputWriter", InMemoryOutputWriter).asSingleton();

export async function functionApp(): Promise<HttpResponseInit> {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const args: Options = { date: endOfToday };

    await main(args, container);

    const writer = container.get<InMemoryOutputWriter>("IOutputWriter");
    const value = writer.data;

    return { body: value };
};

app.http('GenerateRecommendationsManualTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext) => {
        return await functionApp();
    }
});

// app.timer('GenerateRecommendationsSunday1800Trigger', {
//     schedule: '0 18 * * SUN',
//     handler: async (request: Timer, context: InvocationContext) => {
//         await functionApp();
//     }
// });