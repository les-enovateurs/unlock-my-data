import { renderHook, waitFor, act } from '@testing-library/react';
import { useRiskData } from '../useRiskData';

global.fetch = jest.fn();

describe('useRiskData() Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockServices = [{ slug: 'whatsapp', name: 'WhatsApp', exodus: true, tosdr: 'A', url: '', logo: '' }];

    it('should initially return empty data and loading true', async () => {
        // Return unresolved promise simply to test initial state
        (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => useRiskData(mockServices, 'en'));

        expect(result.current.loading).toBe(true);
        expect(result.current.manualData).toEqual({});
        expect(result.current.quickRiskCache).toEqual({});
        expect(result.current.quickRiskScoreCache).toEqual({});
        expect(result.current.breachData).toEqual({});
    });

    it('should fetch data successfully and populate manualData with alternatives', async () => {
        (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
            if (url.includes('/data/manual/')) {
                return {
                    ok: true,
                    json: async () => ({
                        slug: 'whatsapp',
                        alternatives: ['signal', 'telegram'],
                        easy_access_data: "2/5",
                        sanctioned_by_cnil: false,
                        outside_eu_storage: false
                    })
                };
            } else if (url.includes('breach-mapping.json')) {
                return {
                    ok: true,
                    json: async () => ({})
                };
            }
            return { ok: false };
        });

        const { result } = renderHook(() => useRiskData(mockServices, 'en'));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Assert that the manualData was populated properly including alternatives
        expect(result.current.manualData['whatsapp']).toBeDefined();
        expect(result.current.manualData['whatsapp'].alternatives).toEqual(['signal', 'telegram']);
        expect(result.current.manualData['whatsapp'].sanctioned_by_cnil).toBe(false);
    });

    it('should handle fetch errors gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        let result: any;
        await act(async () => {
            const hook = renderHook(() => useRiskData(mockServices, 'en'));
            result = hook.result;
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.manualData).toEqual({});
    });
});
