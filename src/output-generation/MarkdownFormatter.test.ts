import { describe, it, expect, beforeEach } from "vitest";
import { MarkdownFormatter } from "./MarkdownFormatter";

describe("Markdown formatter", () => {

    let sut: MarkdownFormatter;
    beforeEach(() => {
        sut = new MarkdownFormatter();
    });

    it("called, generates header", () => {
        const date = new Date("2023-05-28");

        const expected = `
28/05/2023 00:10:00 AM
Weekly Release Radar 28/05/2023
---
A roundup of new releases this week, presented in no particular order.        
`.trim();

        const result = sut.generate(date, []);

        expect(result).toContain(expected);
    });

    it("called, zero-pads days and months in date", () => {
        const date = new Date("2023-01-01");

        const expected = `
01/01/2023 00:10:00 AM
Weekly Release Radar 01/01/2023
---
A roundup of new releases this week, presented in no particular order.        
`.trim();

        const result = sut.generate(date, []);

        expect(result).toContain(expected);
    });

    it("called, doesn't zero-pad days and months in two digit dates", () => {
        const date = new Date("2023-11-11");

        const expected = `
11/11/2023 00:10:00 AM
Weekly Release Radar 11/11/2023
---
A roundup of new releases this week, presented in no particular order.        
`.trim();

        const result = sut.generate(date, []);

        expect(result).toContain(expected);
    });

    it("called, triggers album template when track is from album", () => {
        const date = new Date("2023-11-11");
        const expected = `album came out this week, check out the track`;

        const result = sut.generate(date, [
            { isFromAlbum: true, track: "track", artist: "artist", album: "album", trackData: {} as any, url: "", similarArtists: [] }
        ]);

        expect(result).toContain(expected);
    });

    it("called, only outputs first three similar artists in recommendation", () => {
        const date = new Date("2023-11-11");

        const result = sut.generate(date, [
            {
                isFromAlbum: true, track: "track", artist: "artist", album: "album", trackData: {} as any, url: "", similarArtists: [
                    { name: "artist1" } as any,
                    { name: "artist2" } as any,
                    { name: "artist3" } as any,
                    { name: "artist4" } as any,
                ]
            },
            {
                isFromAlbum: false, track: "track", artist: "artist", album: "album", trackData: {} as any, url: "", similarArtists: [
                    { name: "artist1" } as any,
                    { name: "artist2" } as any,
                    { name: "artist3" } as any,
                    { name: "artist4" } as any,
                ]
            },
        ]);

        expect(result).toContain("artist1");
        expect(result).toContain("artist2");
        expect(result).toContain("artist3");
        expect(result).not.toContain("artist4");
    });

});