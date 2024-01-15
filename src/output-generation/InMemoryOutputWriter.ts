import { IOutputWriter } from "../types";

export class InMemoryOutputWriter implements IOutputWriter {
    private _executionDate: Date | undefined;
    private _data: string | undefined;

    public get hasSaved(): boolean {
        return this._executionDate !== undefined && this._data !== undefined;
    }

    public get executionDate(): Date | undefined {
        return this._executionDate;
    }

    public get data(): string | undefined {
        return this._data;
    }

    public save(executionDate: Date, fromTemplate: string) {
        this._executionDate = executionDate;
        this._data = fromTemplate;
        return;
    }
}