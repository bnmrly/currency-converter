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

  // TODO: filter end date and date.now

  return currencies.map((currency) => ({
    value: currency.iso_code,
    label: currency.name,
  }));
};
