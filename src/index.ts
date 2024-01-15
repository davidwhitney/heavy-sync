import * as dotenv from "dotenv";
import { Container } from "cruet";
import { ContainerConfiguration } from "./infrastructure/ContainerConfiguration";
import { GenerateRecommendationsCommand } from "./recommendations/GenerateRecommendationsCommand";
import { Options } from "./types";
import { parseOptions } from "./infrastructure/OptionsParser";

dotenv.config();
const container = new Container();
container.addModule(new ContainerConfiguration());

const options: Options = parseOptions(process.argv);

if (options.run) {
    main(options, container)
        .then(code => process.exit(code));
}

export async function main(args: Options, container: Container): Promise<number> {
    const command = container.get<GenerateRecommendationsCommand>(GenerateRecommendationsCommand);
    await command.execute(args);
    return 0;
}