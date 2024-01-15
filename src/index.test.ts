import { describe, it, expect, beforeEach } from 'vitest';
import { main } from './index';
import { Container } from 'cruet';
import { ContainerConfiguration } from './ContainerConfiguration';
import { FakeSpotifyApi } from './test-support/FakeSpotifyApi';
import { StubOutputWriter } from './test-support/StubOutputWriter';
import { IOutputWriter } from './types';

describe('index', () => {

    let container: Container;
    let outputWriter: StubOutputWriter;

    beforeEach(() => {
        outputWriter = new StubOutputWriter();

        container = new Container();
        container.addModule(new ContainerConfiguration());
        container.reregister("SpotifyApi", new FakeSpotifyApi());
        container.reregister("IOutputWriter", outputWriter);
    });

    it('main, called, exit code should be 0', async () => {
        const args = { date: new Date("2023-05-28") };
        const exitCode = await main(args, container);

        expect(exitCode).toBe(0);
    });


    it('main, called, saves file on output writer', async () => {
        const args = { date: new Date("2023-05-28") };
        await main(args, container);

        expect(outputWriter.hasSaved).toBe(true);
        expect(outputWriter.executionDate?.toISOString()).toBe("2023-05-28T00:00:00.000Z");
        expect(outputWriter.data).not.toBe("");
    });
});