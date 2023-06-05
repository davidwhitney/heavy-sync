import type { Recommendation } from "./types";

export function generateMarkdown(recommendations: Recommendation[]) {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const orderedByPopularity = recommendations.sort((a, b) => b.trackData.popularity - a.trackData.popularity);

    return template(formattedDate, orderedByPopularity);
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

[Listen on Spotify](${rec.url})
`.trimStart();


const albumTemplate = (rec: Recommendation) => `
## ${rec.artist} - ${rec.album} (ALBUM)

${rec.artist}'s track came out this week, check out "${rec.track}".

[Listen on Spotify](${rec.url})
`.trimStart();
