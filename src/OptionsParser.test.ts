import { describe, it, expect } from 'vitest';
import { parseOptions } from './OptionsParser';

describe('Options parser', () => {
    it('can parse run flag', async () => {
        const options = parseOptions([`--run`]);
        expect(options.run).toBe(true);
    });

    it('can parse run flag (abbreviated)', async () => {
        const options = parseOptions([`-r`]);
        expect(options.run).toBe(true);
    });

    it('can parse a start date', async () => {
        const arg = `--date=20230113`;

        const options = parseOptions([arg]);

        expect(options.date?.toISOString()).toBe("2023-01-13T00:00:00.000Z");
    });


    it('no date provided, defaults to end of today', async () => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const options = parseOptions([]);

        expect(options.date?.toISOString()).toBe(today.toISOString());
    });
});