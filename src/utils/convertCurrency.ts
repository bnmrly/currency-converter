export type CurrencyCode = string;

type ConvertCurrencyArgs = {
  amount: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
};

type ConvertCurrencyApiResponse = {
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  date: string;
};

type ConvertCurrencyResult = {
  amount: number;
  convertedAmount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  date: string;
};

export const convertCurrency = async ({
  amount,
  fromCurrency,
  toCurrency,
}: ConvertCurrencyArgs): Promise<ConvertCurrencyResult> => {
  // TODO: do null checks with zod re amount

  const parsedAmount = Number(amount);

  const url = `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const result: ConvertCurrencyApiResponse = await response.json();

  const convertedAmount = parsedAmount * result.rate;
  console.log("🚀 _ convertedAmount:", convertedAmount);

  return {
    amount: parsedAmount,
    convertedAmount,
    fromCurrency: result.base,
    toCurrency: result.quote,
    rate: result.rate,
    date: result.date,
  };
};
