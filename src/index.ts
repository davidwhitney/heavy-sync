import * as dotenv from "dotenv";
import { Container } from "cruet";
import { ContainerConfiguration } from "./ContainerConfiguration";
import { GenerateRecommendationsCommand } from "./GenerateRecommendationsCommand";
import { Args, Options } from "./types";
import { parseOptions } from "./OptionsParser";

dotenv.config();
const container = new Container();
container.addModule(new ContainerConfiguration());

const options: Options = parseOptions(process.argv);

if (options.run) {
    main({ date: options.date }, container)
        .then(code => process.exit(code));
}

export async function main(args: Args, container: Container): Promise<number> {
    const command = container.get<GenerateRecommendationsCommand>(GenerateRecommendationsCommand);
    await command.execute(args);
    return 0;
}