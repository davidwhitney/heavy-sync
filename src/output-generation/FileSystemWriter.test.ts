import { describe, it, expect, beforeEach } from 'vitest';
import { FileSystemWriter } from './FileSystemWriter';
import * as fs from "fs";

describe("File system writer", () => {

    let sut: FileSystemWriter;
    beforeEach(() => {
        sut = new FileSystemWriter();
    });

    it("can write file", async () => {
        const fileName = "./src/output/19990528-new-music.md";

        sut.save(new Date("1999-05-28"), "test");

        expect(fs.existsSync(fileName)).toBe(true);
    });
});