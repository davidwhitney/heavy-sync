import * as fs from "fs";
import * as path from "path";
import type { IOutputWriter } from "./types";

export class FileSystemWriter implements IOutputWriter {

    public save(executionDate: Date, fromTemplate: string) {
        const outDir = path.join(__dirname, "..", "output");
        const paddedDate = executionDate.getDate() < 10 ? `0${executionDate.getDate()}` : executionDate.getDate();
        const paddedMonth = executionDate.getMonth() + 1 < 10 ? `0${executionDate.getMonth() + 1}` : executionDate.getMonth() + 1;

        const fileName = `${executionDate.getFullYear()}${paddedMonth}${paddedDate}-new-music.md`;
        const filePath = path.join(outDir, fileName);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }

        fs.writeFileSync(filePath, fromTemplate);
    }
}