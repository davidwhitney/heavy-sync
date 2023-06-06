import { describe, it, expect } from 'vitest';
import { main } from './index';

describe('index', () => {
    it('main, called, exit code should be 0', async () => {
        const exitCode = await main({
            date: new Date("2021-01-01")
        });
        expect(exitCode).toBe(0);
    });
});