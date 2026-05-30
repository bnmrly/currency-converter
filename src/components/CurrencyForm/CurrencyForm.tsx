import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from "@/consts/currency";
import { convertCurrency, getCurrencies } from "@/utils";
import type { Currency, CurrencyCode } from "@/utils";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type Inputs = {
  amount: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
}; //TODO: zod stuff

export const CurrencyForm = () => {
  const { register, control, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: {
      amount: "100",
      fromCurrency: DEFAULT_FROM_CURRENCY,
      toCurrency: DEFAULT_TO_CURRENCY,
    },
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencyList = await getCurrencies();
        setCurrencies(currencyList);

        if (currencyList.length === 0) return;

        const availableCurrencyValues = new Set(
          currencyList.map((currency) => currency.value),
        );

        const fallbackFromCurrency = currencyList[0].value;

        const fallbackToCurrency =
          currencyList[1]?.value ?? fallbackFromCurrency;

        if (!availableCurrencyValues.has(DEFAULT_FROM_CURRENCY)) {
          setValue("fromCurrency", fallbackFromCurrency);
        }

        if (!availableCurrencyValues.has(DEFAULT_TO_CURRENCY)) {
          setValue("toCurrency", fallbackToCurrency);
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadCurrencies();
  }, [setValue]);

  const fromCurrency = useWatch({
    control,
    name: "fromCurrency",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await convertCurrency(data);
      console.log("conversion result:", result);
    } catch (err) {
      if (err instanceof Error) console.log("err", err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-md border-[5px] border-green-500 p-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="amount">Amount</label>
            <div className="flex items-center rounded-md border border-gray-400 px-4">
              <input
                id="amount"
                {...register("amount")}
                type="text" // revisit
                inputMode="decimal"
                min="0"
                // step="0.01"
                required
                className="w-full bg-transparent text-xl outline-none"
              />
              <span className="ml-3 text-sm font-medium">{fromCurrency}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="from-currency">From</label>
            {currencies.length > 0 && (
              <select id="from-currency" {...register("fromCurrency")}>
                {currencies.map((currency: Currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="to-currency">To</label>
            {currencies.length > 0 && (
              <select id="to-currency" {...register("toCurrency")}>
                {currencies.map((currency: Currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button type="submit" className="bg-gray-300 rounded-md p-2">
            Convert
          </button>
        </div>
        <section className="flex flex-1 flex-col gap-2 rounded-md border border-gray-300 p-4">
          <p>This is the results section</p>
        </section>
      </div>
    </form>
  );
};
