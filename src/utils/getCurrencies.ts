type CurrencyApiResponse = {
  iso_code: string;
  name: string;
  symbol: string;
  iso_numeric: string;
  start_date: string;
  end_date: string | null;
};

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

  const currencies: CurrencyApiResponse[] = await currencyResponse.json();

  // If the API starts returning expired currencies, filter out items with an end_date before today, so users only see currencies that can be converted.

  const collator = new Intl.Collator("en-GB", { sensitivity: "base" });

  return currencies
    .map((currency) => ({
      value: currency.iso_code,
      label: currency.name,
    }))
    .sort((a, b) => collator.compare(a.label, b.label));
};
