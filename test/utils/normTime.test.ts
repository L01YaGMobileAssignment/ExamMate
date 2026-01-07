import { normTime } from '../../src/utils/normTime';

describe('normTime', () => {
    describe('with string date input', () => {
        it('should format ISO date string correctly', () => {
            const result = normTime('2026-01-07T10:30:00Z');

            // Check that it contains expected parts (locale differences may affect exact format)
            expect(result).toContain('2026');
            expect(result).toContain('Jan');
            expect(result).toContain('7');
        });

        it('should format date-only string correctly', () => {
            const result = normTime('2026-06-15');

            expect(result).toContain('2026');
            expect(result).toContain('Jun');
            expect(result).toContain('15');
        });
    });

    describe('with numeric timestamp input', () => {
        it('should format Unix timestamp in seconds correctly', () => {
            // Timestamp for Jan 7, 2026 10:30:00 UTC
            const timestamp = 1767779400;
            const result = normTime(timestamp);

            expect(result).toContain('2026');
            expect(result).toContain('Jan');
        });

        it('should format Unix timestamp in milliseconds correctly', () => {
            // Timestamp in milliseconds for Jan 7, 2026 10:30:00 UTC
            const timestampMs = 1767779400000;
            const result = normTime(timestampMs);

            expect(result).toContain('2026');
            expect(result).toContain('Jan');
        });

        it('should convert small timestamps (seconds) to milliseconds', () => {
            // A timestamp in seconds (less than 10000000000)
            const timestampSeconds = 1767779400;
            const result = normTime(timestampSeconds);

            // Should be converted to milliseconds and formatted correctly
            expect(result).toContain('2026');
        });

        it('should handle timestamp as string', () => {
            const timestampStr = '1767779400000';
            const result = normTime(timestampStr);

            expect(result).toContain('2026');
            expect(result).toContain('Jan');
        });
    });

    describe('with numeric string input', () => {
        it('should handle numeric string timestamp', () => {
            const result = normTime('1767779400');

            expect(result).toContain('2026');
        });
    });

    describe('edge cases', () => {
        it('should handle Date.now() format timestamp', () => {
            const now = Date.now();
            const result = normTime(now);

            // Should produce a valid formatted string
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle very old timestamps', () => {
            // Jan 1, 2000
            const oldTimestamp = 946684800;
            const result = normTime(oldTimestamp);

            expect(result).toContain('2000');
            expect(result).toContain('Jan');
        });
    });
});
