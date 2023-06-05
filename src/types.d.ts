import { Artist, TrackWithAlbum } from "@spotify/web-api-ts-sdk/dist/mjs/types";

export type TracksGroupedByArtist = { [artist: string]: TrackWithAlbum[] };

export type Recommendation = {
    similarArtists: Artist[];
    artist: string;
    trackData: TrackWithAlbum;
    track: string;
    album: string;
    url: string;
    isFromAlbum: boolean;
};
