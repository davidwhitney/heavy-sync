import { Container, IRegistrationModule } from "cruet";
import { RecommendationGenerator } from "./RecommendationGenerator";
import { SpotifyPlaylistLoader } from "./SpotifyPlaylistLoader";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { FileSystemWriter } from "./FileSystemWriter";
import { GenerateRecommendationsCommand } from "./GenerateRecommendationsCommand";

export class ContainerConfiguration implements IRegistrationModule {
    public registerComponents(container: Container): void {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

        container.register("SpotifyApi", () => SpotifyApi.withClientCredentials(clientId, clientSecret));
        container.register(SpotifyPlaylistLoader);
        container.register(RecommendationGenerator);
        container.register(FileSystemWriter);

        container.register(GenerateRecommendationsCommand);
    }
}