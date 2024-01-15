import { Container } from "cruet";
import { ContainerConfiguration } from '../ContainerConfiguration';
import { FakeSpotifyApi } from './FakeSpotifyApi';
import { StubOutputWriter } from './StubOutputWriter';

export class TestContainerConfiguration extends ContainerConfiguration {
    public outputWriter: StubOutputWriter;
    public spotifyApi: FakeSpotifyApi;

    constructor() {
        super();
        this.spotifyApi = new FakeSpotifyApi();
        this.outputWriter = new StubOutputWriter();
    }

    public registerComponents(container: Container): void {
        super.registerComponents(container);
        container.reregister("SpotifyApi", this.spotifyApi);
        container.reregister("IOutputWriter", this.outputWriter);
    }
}