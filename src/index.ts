import * as dotenv from "dotenv";
import { Container } from "cruet";
import { ContainerConfiguration } from "./ContainerConfiguration";
import { GenerateRecommendationsCommand } from "./GenerateRecommendationsCommand";
import { Args, Options } from "./types";
import commandLineArgs from 'command-line-args';

dotenv.config();

const parseDate = (text: string): Date => {
    return new Date(parseInt(text.slice(0, 4)), parseInt(text.slice(4, 6)) - 1, parseInt(text.slice(6, 8)));
};

const options: Options = commandLineArgs([
    { name: 'run', alias: 'r', type: Boolean },
    { name: 'date', type: (x: string) => parseDate(x) },
    { name: 'from', type: (x: string) => parseDate(x) },
    { name: 'to', type: (x: string) => parseDate(x) },
]);

const container = new Container();
container.addModule(new ContainerConfiguration());

if (options.run) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    main({ date: options.date || endOfToday })
        .then(code => process.exit(code));
}

export async function main(args: Args): Promise<number> {
    const command = container.get<GenerateRecommendationsCommand>(GenerateRecommendationsCommand);
    await command.execute(args);
    return 0;
}