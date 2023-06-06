import * as dotenv from "dotenv";
import { generateMarkdown } from "./WeeklyReportPostGenerator";
import { RecommendationGenerator } from "./RecommendationGenerator";
import { SpotifyPlaylistLoader } from "./input/SpotifyPlaylistLoader";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { FileSystemWriter } from "./writers/FileSystemWriter";
import type { Args } from "./types";
dotenv.config();

export async function main(args: Args): Promise<number> {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    const weekEndingDate = args.date;

    const spotify = SpotifyApi.withClientCredentials(clientId, clientSecret);
    const playlistLoader = new SpotifyPlaylistLoader(spotify);
    const recommendationGenerator = new RecommendationGenerator(playlistLoader);
    const output = new FileSystemWriter();

    const recommendations = await recommendationGenerator.execute(weekEndingDate);
    const fromTemplate = generateMarkdown(weekEndingDate, recommendations);

    output.save(weekEndingDate, fromTemplate);
    return 0;
}

if (process.argv.includes("--run")) {
    const args = {
        date: process.argv.includes("--date")
            ? new Date(process.argv[process.argv.indexOf("--date") + 1])
            : new Date()
    };

    main(args);
}