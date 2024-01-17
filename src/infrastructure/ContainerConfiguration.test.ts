import { describe, it, beforeEach, expect } from 'vitest';
import { ContainerConfiguration } from './ContainerConfiguration';
import { Container } from 'cruet';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

describe('Container Configuration', () => {

    let container: Container;
    beforeEach(() => {
        container = new Container();
        container.addModule(new ContainerConfiguration());
    });

    it('can resolve configured Spotify client', async () => {
        const spotifyClient = container.get<SpotifyApi>("SpotifyApi");

        expect(spotifyClient).toBeDefined();
        expect(spotifyClient).toBeInstanceOf(SpotifyApi);
    });

    it("resolves default InMemoryOutputWriter when no env vars set", async () => {
        const outputWriter = container.get("IOutputWriter");

        expect(outputWriter).toBeDefined();
        expect(outputWriter.constructor.name).toBe("InMemoryOutputWriter");
    });

    it("resolves specified writer when env var set", async () => {
        process.env.OUTPUTWRITER = "FileSystemOutputWriter";

        const outputWriter = container.get("IOutputWriter");

        expect(outputWriter).toBeDefined();
        expect(outputWriter.constructor.name).toBe("FileSystemOutputWriter");
    });

    it("throws when specified writer doesn't exist", async () => {
        process.env.OUTPUTWRITER = "NonExistentWriter";

        expect(() => container.get("IOutputWriter")).toThrowError("No writer found for NonExistentWriter");
    });

    it("returns github writer when specified", async () => {
        process.env.OUTPUTWRITER = "GitHubOutputWriter";
        process.env.GH_REPO = "repo";
        process.env.GH_PAT = "pat";
        process.env.GH_PATH = "path";

        const outputWriter = container.get("IOutputWriter");

        expect(outputWriter).toBeDefined();
        expect(outputWriter.constructor.name).toBe("GitHubOutputWriter");
    });
});