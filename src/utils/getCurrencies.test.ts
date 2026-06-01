import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { getCurrencies } from "./getCurrencies";

const mockFetch = jest.fn<typeof fetch>();

describe("getCurrencies", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    globalThis.fetch = mockFetch;
  });

  it("fetches, maps, and sorts currencies", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          iso_code: "EUR",
          name: "Euro",
          symbol: "€",
          iso_numeric: "978",
          start_date: "1999-01-01",
          end_date: null,
        },
        {
          iso_code: "GBP",
          name: "British Pound",
          symbol: "£",
          iso_numeric: "826",
          start_date: "1694-07-27",
          end_date: null,
        },
      ],
    } as Response);

    const result = await getCurrencies();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.frankfurter.dev/v2/currencies",
    );
    expect(result).toEqual([
      { value: "GBP", label: "British Pound" },
      { value: "EUR", label: "Euro" },
    ]);
  });

  it("throws when the API response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await expect(getCurrencies()).rejects.toThrow(
      "currencyResponse status: 500",
    );
  });
});
