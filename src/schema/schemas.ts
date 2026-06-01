import { z } from "zod";

export const CurrencyFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine(
      (value) => {
        const amount = Number(value);
        return Number.isFinite(amount);
      },
      {
        message: "Amount must be a number",
      },
    )
    .refine(
      (value) => {
        const amount = Number(value);
        return amount > 0;
      },
      {
        message: "Amount must be greater than 0",
      },
    ),
  fromCurrency: z.string(),
  toCurrency: z.string(),
});

export type CurrencyFormValues = z.infer<typeof CurrencyFormSchema>;
