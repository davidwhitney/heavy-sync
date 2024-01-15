import { Container, IRegistrationModule } from "cruet";
import { RecommendationGenerator } from "../recommendations/RecommendationGenerator";
import { SpotifyPlaylistLoader } from "../recommendations/SpotifyPlaylistLoader";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { FileSystemWriter } from "../output-generation/FileSystemWriter";
import { MarkdownFormatter } from "../output-generation/MarkdownFormatter";

export class ContainerConfiguration implements IRegistrationModule {
    public registerComponents(container: Container): void {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

        container.register("SpotifyApi", () => SpotifyApi.withClientCredentials(clientId, clientSecret));
        container.register(SpotifyPlaylistLoader);
        container.register(RecommendationGenerator);
        container.register("IOutputWriter", FileSystemWriter);
        container.register("IOutputFormatter", MarkdownFormatter);
    }
}