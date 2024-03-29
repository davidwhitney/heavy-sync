import * as dotenv from "dotenv";
import { Container } from "cruet";
import { ContainerConfiguration } from "./infrastructure/ContainerConfiguration";
import { IOutputFormatter, IOutputWriter, Options } from "./types";
import { parseOptions } from "./infrastructure/OptionsParser";
import { RecommendationGenerator } from "./recommendations/RecommendationGenerator";

dotenv.config();

export const container = new Container();
container.addModule(new ContainerConfiguration());

const options: Options = parseOptions(process.argv);

export async function main(args: Options, currentContainer: Container): Promise<number> {
    const generator = currentContainer.get<RecommendationGenerator>(RecommendationGenerator);
    const formatter = currentContainer.get<IOutputFormatter>("IOutputFormatter");
    const writer = currentContainer.get<IOutputWriter>("IOutputWriter");

    const recommendations = await generator.execute(args.date);
    const output = formatter.format(args.date, recommendations);
    await writer.save(args.date, output);

    return 0;
}

/* istanbul ignore if -- @preserve */
if (process.env.TEST !== "true") {
    main(options, container).then(c => process.exit(c));
}