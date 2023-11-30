import { Container } from 'cruet';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContainerConfiguration } from './ContainerConfiguration';
import { GenerateRecommendationsCommand } from './GenerateRecommendationsCommand';
import { FakeSpotifyApi } from './test-support/FakeSpotifyApi';

describe('GenerateRecommendationsCommand', () => {

    let sut: GenerateRecommendationsCommand;
    
    beforeEach(() => {
        const container = new Container();
        container.addModule(new ContainerConfiguration());
        container.reregister("SpotifyApi", () => {
            return new FakeSpotifyApi();
        });

        sut = container.get<GenerateRecommendationsCommand>("GenerateRecommendationsCommand");
    });

    it('execute, with args, ...', async () => {
        const args = {
            date: new Date("2023-05-28")
        };

        const result = await sut.execute(args);

    });
});