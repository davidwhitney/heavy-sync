# heavy-sync

Heavy Sync updates the HEAVY blog from Spotify playlists created throughout the week.

## Config

You need to provide the following environmental configuration:

```env
SPOTIFY_CLIENT_ID=GUID
SPOTIFY_CLIENT_SECRET=GUID
GITHUB_REPO=davidwhitney/heavy
GITHUB_PATH=HeavyCult.Website/BlogContent
GITHUB_PAT=github_pat_11A....
OUTPUTWRITER=FileSystemOutputWriter|GitHubOutputWriter|InMemoryOutputWriter
```

This task executes on a schedule in GitHub Actions, so you'll need to ensure the runner has the correct environment variables set.

## Local Execution

You can run this locally by setting the environment variables and then running the following:

```bash
npm run start
```

`.env` files are supported.

## Tokens

You can get a Spotify Client ID and Secret from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).

You can get a GitHub PAT from the GitHub Developer Settings. You'll need to ensure it has access to the repo you're trying to write to. **NOTE** this PAT will expire every year.
