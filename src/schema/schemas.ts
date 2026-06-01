import { z } from "zod";

// Cap at 1 Billion
const MAX_CONVERSION_AMOUNT = 1_000_000_000;

// Accept only plain decimal amounts, so values like "1e6", "£10", and "1,000" are rejected.
const DECIMAL_AMOUNT_PATTERN = /^\d+(\.\d+)?$/;

export const CurrencyFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .regex(DECIMAL_AMOUNT_PATTERN, "Amount must be a number")
    .refine(
      (value) => {
        const amount = Number(value);
        return !DECIMAL_AMOUNT_PATTERN.test(value) || Number.isFinite(amount);
      },
      {
        message: "Amount is too large",
      },
    )
    .refine(
      (value) => {
        const amount = Number(value);
        return !Number.isFinite(amount) || amount > 0;
      },
      {
        message: "Amount must be greater than 0",
      },
    )
    // Most currencies use 2 decimal places - some use 0 or 3, but 2 is a sensible default for this converter.
    .refine(
      (value) => {
        const decimalPlaces = value.split(".")[1]?.length ?? 0;
        return decimalPlaces <= 2;
      },
      {
        message: "Amount can only have 2 decimal places",
      },
    )
    .refine(
      (value) => {
        const amount = Number(value);
        return !Number.isFinite(amount) || amount <= MAX_CONVERSION_AMOUNT;
      },
      {
        message: "Amount must be 1,000,000,000 or less",
      },
    ),
  fromCurrency: z.string(),
  toCurrency: z.string(),
});

export type CurrencyFormValues = z.infer<typeof CurrencyFormSchema>;
