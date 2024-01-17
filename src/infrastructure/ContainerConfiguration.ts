import { Container, IRegistrationModule } from "cruet";
import { RecommendationGenerator } from "../recommendations/RecommendationGenerator";
import { SpotifyPlaylistLoader } from "../recommendations/SpotifyPlaylistLoader";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { FileSystemOutputWriter } from "../output-generation/FileSystemOutputWriter";
import { MarkdownFormatter } from "../output-generation/MarkdownFormatter";
import { InMemoryOutputWriter } from "../output-generation/InMemoryOutputWriter";
import { GitHubOutputWriter } from "../output-generation/GitHubOutputWriter";

export class ContainerConfiguration implements IRegistrationModule {
    public registerComponents(container: Container): void {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

        container.register("SpotifyApi", () => SpotifyApi.withClientCredentials(clientId, clientSecret));
        container.register(SpotifyPlaylistLoader);
        container.register(RecommendationGenerator);
        container.register("IOutputFormatter", MarkdownFormatter);

        container.register("IOutputWriter", () => {
            const writer = process.env.OUTPUTWRITER || InMemoryOutputWriter.name;

            switch (writer) {
                case FileSystemOutputWriter.name:
                    return new FileSystemOutputWriter("./output");
                case GitHubOutputWriter.name:
                    return new GitHubOutputWriter(
                        process.env.GH_REPO!,
                        process.env.GH_PAT!,
                        process.env.GH_PATH!
                    );
                case InMemoryOutputWriter.name:
                    return new InMemoryOutputWriter();
                default:
                    throw new Error(`No writer found for ${writer}`);
            }
        });
    }
}