import { describe, it, expect, beforeEach } from 'vitest';
import { FileSystemOutputWriter } from './FileSystemOutputWriter';
import * as fs from "fs";

describe("File system writer", () => {

    let sut: FileSystemOutputWriter;
    beforeEach(() => {
        sut = new FileSystemOutputWriter();
    });

    it("can write file", async () => {
        const fileName = "./src/output/19990528-new-music.md";

        sut.save(new Date("1999-05-28"), "test");

        expect(fs.existsSync(fileName)).toBe(true);
    });

    it("can write file when output directory doesn't exist", async () => {
        const randomDirName = `./src/output/${Math.random()}`;
        const fileName = `${randomDirName}/19990528-new-music.md`;

        sut = new FileSystemOutputWriter(randomDirName);

        sut.save(new Date("1999-05-28"), "test");

        expect(fs.existsSync(fileName)).toBe(true);

        fs.rmSync(fileName);
        fs.rmdirSync(randomDirName);
    });
});