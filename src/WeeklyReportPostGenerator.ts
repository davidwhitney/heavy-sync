import type { Recommendation } from "./types";

export function generateMarkdown(recommendations: Recommendation[]) {
    const date = new Date();

    const paddedDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const paddedMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const formattedDate = `${paddedDate}/${paddedMonth}/${date.getFullYear()}`;

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

${rec.artist}'s album came out this week, check out the track "${rec.track}".

[Listen on Spotify](${rec.url})
`.trimStart();
