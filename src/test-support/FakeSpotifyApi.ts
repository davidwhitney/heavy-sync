import fs from 'fs';
import path from 'path';

export class FakeSpotifyApi {

    constructor() {    
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

        getPlaylistItems: async (playlistId: string, fields?: string, limit?: number, offset?: number, market?: string) => {
            return fs.readFileSync(path.join(__dirname, "..", "test-support", "examples", "getPlaylistItems.json"), "utf8");
        }
    };
}