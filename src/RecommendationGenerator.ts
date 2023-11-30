import type { PlaylistedTrack, Track } from "@spotify/web-api-ts-sdk";
import { SpotifyPlaylistLoader } from "./input/SpotifyPlaylistLoader";
import type { Recommendation, TracksGroupedByArtist } from "./types";
import { Inject } from "cruet";

export class RecommendationGenerator {

    constructor(@Inject("SpotifyPlaylistLoader") private playlistLoader: SpotifyPlaylistLoader) {
    }

    public async execute(effectiveDate: Date) {
        const startDate = this.getStartOfPreviousSevenDayPeriod(effectiveDate);
        const endDate = new Date(effectiveDate);

        const tracksAddedThisWeek = await this.playlistLoader.getPlaylistedTracksBetween(startDate, endDate);

        const tracksGroupedByArtist = this.groupTracksByArtist(tracksAddedThisWeek);
        const recommendations = this.mapTracksToRecommendations(tracksGroupedByArtist);

        for (const rec of recommendations) {
            const similarArtists = await this.playlistLoader.getRelatedArtists(rec.trackData.artists[0].id);
            rec.similarArtists = similarArtists;
        }

        return recommendations;
    }

    private groupTracksByArtist(tracksAddedThisWeek: PlaylistedTrack[]) {
        return tracksAddedThisWeek.reduce((acc, t) => {
            const track = t.track! as Track;
            const artist = track.artists[0].name;
            if (!acc[artist]) {
                acc[artist] = [];
            }

            acc[artist].push(track);
            return acc;
        }, {} as TracksGroupedByArtist);
    }

    private mapTracksToRecommendations(tracksGroupedByArtist: TracksGroupedByArtist): Recommendation[] {
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
                similarArtists: [],
                trackData: highestPopularityTrack,
                track: highestPopularityTrack.name,
                album: highestPopularityTrack.album.name,
                url: highestPopularityTrack.external_urls.spotify,
                isFromAlbum: highestPopularityTrack.album.album_type === "album",
            };
        });
    }

    private getStartOfPreviousSevenDayPeriod(effectiveDate: Date): Date {
        const date = new Date(effectiveDate);
        date.setDate(date.getDate() - 6);
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    }

}
