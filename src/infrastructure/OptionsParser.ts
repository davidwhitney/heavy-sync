import { Options } from "../types";
import commandLineArgs from 'command-line-args';

export function parseOptions(args: string[]): Options {
    let options: Options;

    try {
        // This fails to load in function apps, but that's fine
        // because we'll be using the current date anyway.

        const parsed: Options = commandLineArgs([
            { name: 'run', alias: 'r', type: Boolean },
            { name: 'date', type: (x: string) => parseDate(x) }
        ], { argv: args });
        options = parsed;
    } catch (e) {
        options = { date: undefined, run: false };
    }

    if (!options.date) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        options.date = endOfToday;
    }

    return options;
}

function parseDate(text: string): Date {
    return new Date(
        Date.UTC(
            parseInt(text.slice(0, 4)),
            parseInt(text.slice(4, 6)) - 1,
            parseInt(text.slice(6, 8)),
            0, 0, 0
        )
    );
};