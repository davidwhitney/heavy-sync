import * as dotenv from "dotenv";
import { SpotifyPlaylistLoader } from "./SpotifyPlaylistLoader";
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk/dist/mjs/types";
import { getStartOfPreviousSevenDayPeriod } from "./DateUtils";
import { generateMarkdown } from "./WeeklyReportPostGenerator";
import type { Recommendation, TracksGroupedByArtist } from "./types";
import * as fs from "fs";
import * as path from "path";
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

    const tracksGroupedByArtist = groupTracksByArtist(tracksAddedThisWeek);
    const recommendations = mapTracksToRecommendations(tracksGroupedByArtist);

    const fromTemplate = generateMarkdown(recommendations);

    // save to file
    const outDir = path.join(__dirname, "..", "output");
    const filePath = path.join(outDir, `${year}-week-${startDate.getDate()}-${startDate.getMonth() + 1}.md`);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    fs.writeFileSync(filePath, fromTemplate);


    return 0;
}


function groupTracksByArtist(tracksAddedThisWeek: PlaylistedTrack[]) {
    return tracksAddedThisWeek.reduce((acc, t) => {
        const artist = t.track.artists[0].name;
        if (!acc[artist]) {
            acc[artist] = [];
        }

        acc[artist].push(t.track);
        return acc;
    }, {} as TracksGroupedByArtist);
}

function mapTracksToRecommendations(tracksGroupedByArtist: TracksGroupedByArtist): Recommendation[] {
    return Object.keys(tracksGroupedByArtist).map((artist) => {
        const tracks = tracksGroupedByArtist[artist];
        const highestPopularityTrack = tracks.reduce((acc, t) => {
            if (t.popularity > acc.popularity) {
                return t;
            }

            return acc;
        }, tracks[0]);

        // generate recommendation object
        return {
            artist,
            trackData: highestPopularityTrack,
            track: highestPopularityTrack.name,
            album: highestPopularityTrack.album.name,
            url: highestPopularityTrack.external_urls.spotify,
            isFromAlbum: highestPopularityTrack.album.album_type === "album",
        };
    });
}
