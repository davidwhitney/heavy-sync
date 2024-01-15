import * as dotenv from "dotenv";
import { Container } from "cruet";
import { ContainerConfiguration } from "./infrastructure/ContainerConfiguration";
import { IOutputFormatter, IOutputWriter, Options } from "./types";
import { parseOptions } from "./infrastructure/OptionsParser";
import { RecommendationGenerator } from "./recommendations/RecommendationGenerator";

dotenv.config();

const container = new Container();
container.addModule(new ContainerConfiguration());
const options: Options = parseOptions(process.argv);

if (options.run) {
    main(options, container).then(code => process.exit(code));
}

export async function main(args: Options, container: Container): Promise<number> {
    const generator = container.get<RecommendationGenerator>(RecommendationGenerator);
    const writer = container.get<IOutputWriter>("IOutputWriter");
    const formatter = container.get<IOutputFormatter>("IOutputFormatter");

    const recommendations = await generator.execute(args.date);
    const fromTemplate = formatter.generate(args.date, recommendations);
    writer.save(args.date, fromTemplate);

    return 0;
}
