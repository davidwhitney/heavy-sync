import { describe, it, beforeEach, expect } from 'vitest';
import { ContainerConfiguration } from './ContainerConfiguration';
import { Container } from 'cruet';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

describe('Container Configuration', () => {

    let container: Container;
    beforeEach(() => {
        container = new Container();
        container.addModule(new ContainerConfiguration());
    });

    it('can resolve configured Spotify client', async () => {
        const spotifyClient = container.get<SpotifyApi>("SpotifyApi");

        expect(spotifyClient).toBeDefined();
        expect(spotifyClient).toBeInstanceOf(SpotifyApi);
    });
});