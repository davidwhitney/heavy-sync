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

        const supportedWriters = new Map<string, any>();
        supportedWriters.set("FileSystemWriter", FileSystemOutputWriter);
        supportedWriters.set("InMemoryWriter", InMemoryOutputWriter);
        supportedWriters.set("GitHubOutputWriter", GitHubOutputWriter);

        container.register("IOutputWriter", supportedWriters.get(process.env.OUTPUTWRITER!));
    }
}