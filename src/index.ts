import { Container } from "cruet";
import * as dotenv from "dotenv";
import { ContainerConfiguration } from "./ContainerConfiguration";
import { GenerateRecommendationsCommand } from "./GenerateRecommendationsCommand";
import { Args } from "./types";

dotenv.config();

export async function main(args: Args): Promise<number> {
    const container = new Container();
    container.addModule(new ContainerConfiguration());

    const command = container.get<GenerateRecommendationsCommand>("GenerateRecommendationsCommand");
    command.execute(args);
    return 0;
}

if (process.argv.includes("--run")) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const args = {
        date: process.argv.includes("--date")
            ? new Date(process.argv[process.argv.indexOf("--date") + 1])
            : endOfToday
    };

    main(args).then(code => process.exit(code));
}