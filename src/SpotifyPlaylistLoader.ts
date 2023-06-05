import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk/dist/mjs/types";

export class SpotifyPlaylistLoader {
    private spotify: SpotifyApi;

    constructor() {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
        this.spotify = SpotifyApi.withClientCredentials(clientId, clientSecret);
    }

    public async findCurrentYearPlaylistId(year: number): Promise<string> {
        const playlists = await this.spotify.playlists.getUsersPlaylists("davidwhitney");
        const specificPlaylist = playlists.items.find((p: { name: string; }) => p.name.toLowerCase() === `${year} new music`);
        if (!specificPlaylist) {
            throw new Error(`No playlist found for ${year}`);
        }

        return specificPlaylist.id;
    }

    public async getAllPlaylistItems(playlistId: string): Promise<PlaylistedTrack[]> {
        const playlist = await this.spotify.playlists.getPlaylistItems(playlistId);

        const tracks: PlaylistedTrack[] = [];

        while (tracks.length < playlist.total) {
            const playlistContents = await this.spotify.playlists.getPlaylistItems(playlistId, undefined, undefined, undefined, tracks.length);
            if (!playlistContents || !playlistContents.items) {
                break;
            }

            const asPlaylistedTrack = playlistContents.items as any as PlaylistedTrack[]; // bugfix required to SDK.
            tracks.push(...asPlaylistedTrack);
        }

        console.log(`Found ${tracks.length} tracks.`);
        console.log(tracks[0]);

        return tracks;
    }

}