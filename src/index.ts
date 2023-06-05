import * as dotenv from "dotenv";
import { SpotifyPlaylistLoader } from "./SpotifyPlaylistLoader";
import { TrackWithAlbum } from "@spotify/web-api-ts-sdk/dist/mjs/types";
import { getStartOfPreviousSevenDayPeriod } from "./DateUtils";
dotenv.config();

if (process.argv.includes("--run")) {
    main().then((exitCode) => process.exit(exitCode));
}

export async function main(): Promise<number> {
    const executionDate = new Date();
    const year = executionDate.getFullYear();

    const spotifyConnection = new SpotifyPlaylistLoader();
    const playlistId = await spotifyConnection.findCurrentYearPlaylistId(year);
    const tracks = await spotifyConnection.getAllPlaylistItems(playlistId);

    const startDate = getStartOfPreviousSevenDayPeriod();
    const endDate = new Date();

    const tracksAddedThisWeek = tracks.filter((t) => {
        const addedDate = new Date(t.added_at);
        return addedDate >= startDate && addedDate <= endDate;
    });

    console.log("Tracks added this week: ", tracksAddedThisWeek.length);

    const tracksGroupedByArtist = tracksAddedThisWeek.reduce((acc, t) => {
        const artist = t.track.artists[0].name;
        if (!acc[artist]) {
            acc[artist] = [];
        }

        acc[artist].push(t.track);
        return acc;
    }, {} as { [artist: string]: TrackWithAlbum[] });


    // generate recommendations by picking the track with the highest "popularity" value from each of the groups
    const recommendations = Object.keys(tracksGroupedByArtist).map((artist) => {
        const tracks = tracksGroupedByArtist[artist];
        const highestPopularityTrack = tracks.reduce((acc, t) => {
            if (t.popularity > acc.popularity) {
                return t;
            }

            return acc;
        }, tracks[0]);

        // generate recommendation object
        const reccomendation = {
            artist,
            trackData: highestPopularityTrack,
            track: highestPopularityTrack.name,
            album: highestPopularityTrack.album.name,
            url: highestPopularityTrack.external_urls.spotify,
            isFromAlbum: highestPopularityTrack.album.album_type === "album",
        };

        return reccomendation;
    });

    console.log("Recommendations: ", recommendations.length);
    console.log("Recommendations: ", recommendations);


    return 0;
}
