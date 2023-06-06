import { Artist, TrackWithAlbum } from "@spotify/web-api-ts-sdk/dist/mjs/types";

interface IOutputWriter {
    save(executionDate: Date, fromTemplate: string): void;
}

interface TracksGroupedByArtist {
    [artist: string]: TrackWithAlbum[]
}

interface Recommendation {
    similarArtists: Artist[];
    artist: string;
    trackData: TrackWithAlbum;
    track: string;
    album: string;
    url: string;
    isFromAlbum: boolean;
}