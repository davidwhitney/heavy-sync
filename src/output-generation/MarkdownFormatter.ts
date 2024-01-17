import type { IOutputFormatter, Recommendation } from "../types";

export class MarkdownFormatter implements IOutputFormatter {
    public format(date: Date, recommendations: Recommendation[]) {
        const paddedDate = new String(date.getDate()).padStart(2, "0");
        const paddedMonth = new String(date.getMonth() + 1).padStart(2, "0");

        const orderedByPopularity = recommendations.sort((a, b) => b.trackData.popularity - a.trackData.popularity);

        const formattedDate = `${paddedDate}/${paddedMonth}/${date.getFullYear()}`;
        return template(formattedDate, orderedByPopularity);
    }
}

const template = (date: string, recommendations: Recommendation[]) => `
${date} 00:10:00 AM
Weekly Release Radar ${date}
---
A roundup of new releases this week, presented in no particular order.

${recommendations.map(r => {
    return r.isFromAlbum ? albumTemplate(r) : trackTemplate(r)
}).join("\r\n")}
`.trimStart();


const trackTemplate = (rec: Recommendation) => `
## ${rec.artist} - ${rec.track}

<div data-spotify-uri="${rec.trackData.uri}"></div>

[Listen on Spotify](${rec.url})

FFO: ${rec.similarArtists.slice(0, 3).map(a => a.name).join(", ")}
`.trimStart();


const albumTemplate = (rec: Recommendation) => `
## ${rec.artist} - ${rec.album} (ALBUM)

${rec.artist}'s album came out this week, check out the track "${rec.track}".

<div data-spotify-uri="${rec.trackData.uri}"></div>

[Listen on Spotify](${rec.url})

FFO: ${rec.similarArtists.slice(0, 3).map(a => a.name).join(", ")}
`.trimStart();
