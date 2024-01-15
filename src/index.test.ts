import { describe, it, expect, beforeEach } from 'vitest';
import { main } from './index';
import { Container } from 'cruet';
import { ContainerConfiguration } from './ContainerConfiguration';
import { FakeSpotifyApi } from './test-support/FakeSpotifyApi';
import { StubOutputWriter } from './test-support/StubOutputWriter';
import { PlaylistedTrack, SimplifiedAlbum, SimplifiedArtist, Track } from '@spotify/web-api-ts-sdk';

describe('index', () => {

    let container: Container;
    let outputWriter: StubOutputWriter;
    let spotifyApi: FakeSpotifyApi;

    beforeEach(() => {
        outputWriter = new StubOutputWriter();
        spotifyApi = new FakeSpotifyApi();

        container = new Container();
        container.addModule(new ContainerConfiguration());
        container.reregister("SpotifyApi", spotifyApi);
        container.reregister("IOutputWriter", outputWriter);
    });

    it('called, exit code should be 0', async () => {
        const args = { date: new Date("2023-05-28") };
        const exitCode = await main(args, container);

        expect(exitCode).toBe(0);
    });

    it('called, saves file on output writer', async () => {
        const args = { date: new Date("2023-05-28") };
        await main(args, container);

        expect(outputWriter.hasSaved).toBe(true);
        expect(outputWriter.executionDate?.toISOString()).toBe("2023-05-28T00:00:00.000Z");
        expect(outputWriter.data).not.toBe("");
    });

    it('track available in playlist that was added less than seven days ago, exists in output', async () => {
        const args = { date: new Date("2023-05-28") };

        spotifyApi.returnedPlaylistContains({
            track: {
                name: "track1",
                artists: [{ name: "artist1" } as SimplifiedArtist],
                album: { name: "album1" } as SimplifiedAlbum,
                external_urls: { spotify: "http://tempuri.org/the-url" },
            } as Track,
            added_at: "2023-05-28"
        } as PlaylistedTrack);

        await main(args, container);

        expect(outputWriter.data).toContain("track1");
        expect(outputWriter.data).toContain("http://tempuri.org/the-url");
    });

    it('multiple tracks available in playlist that was added less than seven days ago, exists in output', async () => {
        const args = { date: new Date("2023-05-28") };

        spotifyApi.returnedPlaylistContains([
            {
                track: {
                    name: "track1",
                    artists: [{ name: "artist1" } as SimplifiedArtist],
                    album: { name: "album1" } as SimplifiedAlbum,
                    external_urls: { spotify: "http://tempuri.org/the-url1" },
                } as Track,
                added_at: "2023-05-28"
            } as PlaylistedTrack,
            {
                track: {
                    name: "track2",
                    artists: [{ name: "artist2" } as SimplifiedArtist],
                    album: { name: "album2" } as SimplifiedAlbum,
                    external_urls: { spotify: "http://tempuri.org/the-url2" },
                } as Track,
                added_at: "2023-05-28"
            } as PlaylistedTrack
        ]);

        await main(args, container);

        expect(outputWriter.data).toContain("track1");
        expect(outputWriter.data).toContain("http://tempuri.org/the-url1");

        expect(outputWriter.data).toContain("track2");
        expect(outputWriter.data).toContain("http://tempuri.org/the-url2");
    });
});