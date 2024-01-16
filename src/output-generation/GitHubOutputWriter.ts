import type { IOutputWriter } from "../types";

export class GitHubOutputWriter implements IOutputWriter {
    constructor(
        private repoId: string,
        private token: string,
        private path: string
    ) {
        console.log("GitHubOutputWriter Created.");
    }

    public async save(executionDate: Date, data: string): Promise<void> {
        const paddedDate = new String(executionDate.getDate()).padStart(2, "0");
        const paddedMonth = new String(executionDate.getMonth() + 1).padStart(2, "0");
        const fileName = `${executionDate.getFullYear()}${paddedMonth}${paddedDate}-new-music.md`;

        const path = `${this.path}/${fileName}`;
        const url = `https://api.github.com/repos/${this.repoId}/contents/${path}`;

        let sha: string = null;

        const existing = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' }
        });

        if (existing.ok) {
            const existingBody = await existing.json();
            sha = existingBody.sha;
        }

        if (sha) {
            console.log("Existing file found, skipping upload to prevent spamming commits. Delete existing file to resume uploads.");
            return Promise.resolve();
        }

        const contentRequest = {
            "message": `New music for ${executionDate.toDateString()}`,
            "committer": {
                "name": "David Whitney",
                "email": "auto@davidwhitney.co.uk"
            },
            "sha": sha,
            "name": fileName,
            "path": path,
            "type": "file",
            "content": Buffer.from(data).toString('base64')
        };

        const result = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentRequest)
        });

        if (!result.ok) {
            const body = await result.json(); //?
            throw new Error(`Failed to save file: ${body.message}`);
        }
    }
}