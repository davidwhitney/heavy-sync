import * as fs from "fs";
import * as path from "path";
import type { IOutputWriter } from "../types";

export class FileSystemWriter implements IOutputWriter {

    constructor(private outDir: string = null) {
        this.outDir = outDir || path.join(__dirname, "..", "output");
    }

    public save(executionDate: Date, fromTemplate: string) {
        const paddedDate = executionDate.getDate() < 10 ? `0${executionDate.getDate()}` : executionDate.getDate();
        const paddedMonth = executionDate.getMonth() + 1 < 10 ? `0${executionDate.getMonth() + 1}` : executionDate.getMonth() + 1;

        const fileName = `${executionDate.getFullYear()}${paddedMonth}${paddedDate}-new-music.md`;
        const filePath = path.join(this.outDir, fileName);
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir);
        }

        fs.writeFileSync(filePath, fromTemplate);
    }
}