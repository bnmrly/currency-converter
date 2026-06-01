import { z } from "zod";

const CurrencyApiSchema = z.object({
  iso_code: z.string(),
  name: z.string(),
  symbol: z.string(),
  iso_numeric: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
});

const CurrenciesApiResponseSchema = z.array(CurrencyApiSchema);

export type Currency = {
  value: string;
  label: string;
};

export const getCurrencies = async (): Promise<Currency[]> => {
  const currencyResponse = await fetch(
    "https://api.frankfurter.dev/v2/currencies",
  );

  if (!currencyResponse.ok)
    throw new Error(`currencyResponse status: ${currencyResponse.status}`);

  const currencies = CurrenciesApiResponseSchema.parse(
    await currencyResponse.json(),
  );

  // If the API starts returning expired currencies, filter out items with an end_date before today, so users only see currencies that can be converted.

  const collator = new Intl.Collator("en-GB", { sensitivity: "base" });

  return currencies
    .map((currency) => ({
      value: currency.iso_code,
      label: currency.name,
    }))
    .sort((a, b) => collator.compare(a.label, b.label));
};
