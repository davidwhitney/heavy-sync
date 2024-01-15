import { Inject } from "cruet";
import { RecommendationGenerator } from "./RecommendationGenerator";
import type { IOutputFormatter, IOutputWriter, Options, Recommendation } from "../types";

export class GenerateRecommendationsCommand {
    constructor(
        @Inject("RecommendationGenerator") private generator: RecommendationGenerator,
        @Inject("IOutputWriter") private writer: IOutputWriter,
        @Inject("IOutputFormatter") private formatter: IOutputFormatter
    ) {
    }

    public async execute(args: Options) {
        const recommendations = await this.generator.execute(args.date);
        const fromTemplate = this.formatter.generate(args.date, recommendations);
        this.writer.save(args.date, fromTemplate);
        return 0;
    }
}
