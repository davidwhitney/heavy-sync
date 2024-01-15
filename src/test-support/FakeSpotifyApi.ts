import { Page, PlaylistedTrack } from '@spotify/web-api-ts-sdk';
import fs from 'fs';
import path from 'path';

export class FakeSpotifyApi {

    private _returnItems: PlaylistedTrack[] = [];

    constructor() {
    }

    public returnedPlaylistContains(items: PlaylistedTrack | PlaylistedTrack[]) {
        if (Array.isArray(items)) {
            this._returnItems = items;
        } else {
            this._returnItems = [items];
        }
    }

    public playlists = {
        getUsersPlaylists: async (userId: string) => {
            return {
                items: [
                    {
                        id: "playlist-1",
                        name: "2023 New Music"
                    }
                ]
            };
        },

        getPlaylistItems: async (playlistId: string, fields?: string, limit?: number, offset?: number, market?: string): Promise<Page<PlaylistedTrack>> => {
            if (this._returnItems.length > 0) {
                const page: Page<PlaylistedTrack> = {
                    href: "",
                    items: [...this._returnItems],
                    limit: 0,
                    next: "",
                    offset: 0,
                    previous: "",
                    total: this._returnItems.length
                };

                this._returnItems = [];
                return Promise.resolve(page);
            }

            const itemsFromDisk = fs.readFileSync(path.join(__dirname, "..", "test-support", "examples", "getPlaylistItems.json"), "utf8");
            const items = JSON.parse(itemsFromDisk);
            return Promise.resolve(items);
        }
    };

    public artists = {
        relatedArtists: async (artistId: string) => {
            return Promise.resolve({ artists: [] });
        }
    }
}