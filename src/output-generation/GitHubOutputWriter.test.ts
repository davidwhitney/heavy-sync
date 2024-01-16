import { describe, it, beforeEach } from 'vitest';
import { GitHubOutputWriter } from './GitHubOutputWriter';
import * as dotenv from "dotenv";

dotenv.config();

describe("GitHub output writer", () => {

    let sut: GitHubOutputWriter;
    beforeEach(() => {
        sut = new GitHubOutputWriter(
            process.env.GITHUB_REPO!,
            process.env.GITHUB_PAT!,
            process.env.GITHUB_PATH!,
        );
    });

    it("can upload file over the GitHub API", async () => {
        await sut.save(new Date("1990-01-10"), `
01/10/1990 01:00:00 AM
Welcome to HEAVY
---
        `.trim());
    });

});