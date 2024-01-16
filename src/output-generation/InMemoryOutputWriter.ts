import { IOutputWriter } from "../types";

export class InMemoryOutputWriter implements IOutputWriter {
    private _executionDate: Date | undefined;
    private _data: string | undefined;

    constructor() {
        console.log("InMemoryOutputWriter Created.");
    }

    public get hasSaved(): boolean {
        return this._executionDate !== undefined && this._data !== undefined;
    }

    public get executionDate(): Date | undefined {
        return this._executionDate;
    }

    public get data(): string | undefined {
        return this._data;
    }

    public async save(executionDate: Date, fromTemplate: string): Promise<void> {
        this._executionDate = executionDate;
        this._data = fromTemplate;

        console.log("InMemoryOutputWriter: Saved data to memory.");
        console.log(fromTemplate);

        return Promise.resolve();
    }
}