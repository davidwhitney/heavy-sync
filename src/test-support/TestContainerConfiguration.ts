import { Container } from "cruet";
import { ContainerConfiguration } from '../infrastructure/ContainerConfiguration';
import { FakeSpotifyApi } from './FakeSpotifyApi';
import { InMemoryOutputWriter } from '../output-generation/InMemoryOutputWriter';

export class TestContainerConfiguration extends ContainerConfiguration {
    public outputWriter: InMemoryOutputWriter;
    public spotifyApi: FakeSpotifyApi;

    constructor() {
        super();
        this.spotifyApi = new FakeSpotifyApi();
        this.outputWriter = new InMemoryOutputWriter();
    }

    public registerComponents(container: Container): void {
        super.registerComponents(container);
        container.reregister("SpotifyApi", this.spotifyApi);
        container.reregister("IOutputWriter", this.outputWriter);
    }
}