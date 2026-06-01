import { z } from "zod";

export type CurrencyCode = string;

const ConvertCurrencyApiResponseSchema = z.object({
  base: z.string(),
  quote: z.string(),
  rate: z.number().positive(),
  date: z.string(),
});

type ConvertCurrencyArgs = {
  amount: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
};

export type ConvertCurrencyResult = {
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
  const parsedAmount = Number(amount);

  const url = `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const result = ConvertCurrencyApiResponseSchema.parse(await response.json());

  const convertedAmount = parsedAmount * result.rate;

  return {
    amount: parsedAmount,
    convertedAmount,
    fromCurrency: result.base,
    toCurrency: result.quote,
    rate: result.rate,
    date: result.date,
  };
};
