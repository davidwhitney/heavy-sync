import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Page, PlaylistedTrack } from "@spotify/web-api-ts-sdk/dist/mjs/types";
import { Inject } from "cruet";

export class SpotifyPlaylistLoader {  

    constructor(@Inject("SpotifyApi") private spotify: SpotifyApi) {
    }

    public async getPlaylistedTracksBetween(startDate: Date, endDate: Date) {
        const year = startDate.getFullYear();
        const playlistId = await this.findCurrentYearPlaylistId(year);

        const tracksInPeriod: PlaylistedTrack[] = [];

        for await (const t of this.getAllPlaylistItems(playlistId)) {
            const addedDate = new Date(t.added_at);

            if (addedDate >= startDate && addedDate <= endDate) {
                console.log("[Added] track: ", t.track.name);
                tracksInPeriod.push(t);
            } else {
                console.log("[SKIPPED] track: ", t.track.name);
            }
        }

        console.log(`Fetched tracks added between: ${startDate.toString()} AND ${endDate.toString()}`);
        console.log("Tracks added this period: ", tracksInPeriod.length);

        return tracksInPeriod;
    }

    public async findCurrentYearPlaylistId(year: number): Promise<string> {
        const playlists = await this.spotify.playlists.getUsersPlaylists("davidwhitney");
        const specificPlaylist = playlists.items.find((p: { name: string; }) => p.name.toLowerCase() === `${year} new music`);
        if (!specificPlaylist) {
            throw new Error(`No playlist found for ${year}`);
        }

        return specificPlaylist.id;
    }

    public async *getAllPlaylistItems(playlistId: string) {
        let contents: Page<PlaylistedTrack> | null = null;
        let recieveCount = 0;

        do {
            contents = await this.spotify.playlists.getPlaylistItems(playlistId, undefined, undefined, undefined, recieveCount);
            if (!contents || !contents.items) {
                break;
            }

            for (const item of contents.items) {
                yield item;
                recieveCount++;
            }
        } while (recieveCount < contents!.total);
    }

    public async getRelatedArtists(artistId: string) {
        const result = await this.spotify.artists.relatedArtists(artistId);
        return result.artists;
    }

}