import { describe, it, expect, beforeEach } from 'vitest';
import { main } from './index';
import { Container } from 'cruet';
import { TestContainerConfiguration } from './test-support/TestContainerConfiguration';
import { PlaylistedTrack, SimplifiedAlbum, SimplifiedArtist, Track } from '@spotify/web-api-ts-sdk';

describe('index', () => {

    let container: Container;
    let testConfig: TestContainerConfiguration;

    beforeEach(() => {
        testConfig = new TestContainerConfiguration();
        container = new Container();
        container.addModule(testConfig);
    });

    it('called, exit code should be 0', async () => {
        const args = { date: new Date("2023-05-28") };
        const exitCode = await main(args, container);

        expect(exitCode).toBe(0);
    });

    it('called, saves file on output writer', async () => {
        const args = { date: new Date("2023-05-28") };

        await main(args, container);

        expect(testConfig.outputWriter.hasSaved).toBe(true);
        expect(testConfig.outputWriter.executionDate?.toISOString()).toBe("2023-05-28T00:00:00.000Z");
        expect(testConfig.outputWriter.data).not.toBe("");
    });

    it('called, no playlist for year, throws', async () => {
        const args = { date: new Date("1999-05-05") };
        await expect(main(args, container)).rejects.toThrowError("No playlist found for 1999");
    });

    it('track available in playlist that was added less than seven days ago, exists in output', async () => {
        const args = { date: new Date("2023-05-28") };

        testConfig.spotifyApi.returnedPlaylistContains({
            track: {
                name: "track1",
                artists: [{ name: "artist1" } as SimplifiedArtist],
                album: { name: "album1" } as SimplifiedAlbum,
                external_urls: { spotify: "http://tempuri.org/the-url" },
            } as Track,
            added_at: "2023-05-28"
        } as PlaylistedTrack);

        await main(args, container);

        expect(testConfig.outputWriter.data).toContain("track1");
        expect(testConfig.outputWriter.data).toContain("http://tempuri.org/the-url");
    });

    it('multiple tracks available in playlist that was added less than seven days ago, exists in output', async () => {
        const args = { date: new Date("2023-05-28") };

        testConfig.spotifyApi.returnedPlaylistContains([
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

        expect(testConfig.outputWriter.data).toContain("track1");
        expect(testConfig.outputWriter.data).toContain("http://tempuri.org/the-url1");

        expect(testConfig.outputWriter.data).toContain("track2");
        expect(testConfig.outputWriter.data).toContain("http://tempuri.org/the-url2");
    });

    it('multiple tracks for same artist, most popular returned in output', async () => {
        const args = { date: new Date("2023-05-28") };

        testConfig.spotifyApi.returnedPlaylistContains([
            {
                track: {
                    name: "track1",
                    artists: [{ name: "artist1" } as SimplifiedArtist],
                    album: { name: "album1" } as SimplifiedAlbum,
                    external_urls: { spotify: "http://tempuri.org/the-url1" },
                    popularity: 100
                } as Track,
                added_at: "2023-05-28"
            } as PlaylistedTrack,
            {
                track: {
                    name: "track2",
                    artists: [{ name: "artist1" } as SimplifiedArtist],
                    album: { name: "album2" } as SimplifiedAlbum,
                    external_urls: { spotify: "http://tempuri.org/the-url2" },
                    popularity: 200
                } as Track,
                added_at: "2023-05-28"
            } as PlaylistedTrack
        ]);

        await main(args, container);

        expect(testConfig.outputWriter.data).not.toContain("track1");
        expect(testConfig.outputWriter.data).toContain("track2");
    });
});