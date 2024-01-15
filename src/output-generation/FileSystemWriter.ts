import * as fs from "fs";
import * as path from "path";
import type { IOutputWriter } from "../types";

export class FileSystemWriter implements IOutputWriter {
    constructor(private outDir: string = null) {
        this.outDir = outDir || path.join(__dirname, "..", "output");
    }

    public save(executionDate: Date, fromTemplate: string) {
        const paddedDate = new String(executionDate.getDate()).padStart(2, "0");
        const paddedMonth = new String(executionDate.getMonth() + 1).padStart(2, "0");

        const fileName = `${executionDate.getFullYear()}${paddedMonth}${paddedDate}-new-music.md`;
        const filePath = path.join(this.outDir, fileName);
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir);
        }

        fs.writeFileSync(filePath, fromTemplate);
    }
}