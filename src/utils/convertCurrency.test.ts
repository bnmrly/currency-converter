import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { convertCurrency } from "./convertCurrency";

const mockFetch = jest.fn<typeof fetch>();

describe("convertCurrency", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    globalThis.fetch = mockFetch;
  });

  it("fetches the exchange rate and returns the converted result", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        base: "GBP",
        quote: "EUR",
        rate: 1.15,
        date: "2026-06-01",
      }),
    } as Response);

    const result = await convertCurrency({
      amount: "100",
      fromCurrency: "GBP",
      toCurrency: "EUR",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.frankfurter.dev/v2/rate/GBP/EUR",
    );
    expect(result).toMatchObject({
      amount: 100,
      fromCurrency: "GBP",
      toCurrency: "EUR",
      rate: 1.15,
      date: "2026-06-01",
    });
    expect(result.convertedAmount).toBeCloseTo(115);
  });

  it("throws when the API response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await expect(
      convertCurrency({
        amount: "100",
        fromCurrency: "GBP",
        toCurrency: "EUR",
      }),
    ).rejects.toThrow("Response status: 500");
  });
});
