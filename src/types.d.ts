import { Artist, Track } from "@spotify/web-api-ts-sdk/dist/mjs/types";

interface Options {
    run?: boolean;
    date?: Date;
    from?: Date;
    to?: Date;
}

interface IOutputWriter {
    save(executionDate: Date, fromTemplate: string): Promise<void>;
}

interface IOutputFormatter {
    generate(date: Date, recommendations: Recommendation[]): string;
}

interface TracksGroupedByArtist {
    [artist: string]: Track[]
}

interface Recommendation {
    similarArtists: Artist[];
    artist: string;
    trackData: Track;
    track: string;
    album: string;
    url: string;
    isFromAlbum: boolean;
}