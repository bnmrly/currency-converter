import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from "@/consts/currency";
import { convertCurrency, getCurrencies } from "@/utils";
import type { Currency, CurrencyCode, ConvertCurrencyResult } from "@/utils";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type Inputs = {
  amount: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
}; //TODO: zod stuff
//TODO: Error handling for api status codes

export const CurrencyForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      amount: "100",
      fromCurrency: DEFAULT_FROM_CURRENCY,
      toCurrency: DEFAULT_TO_CURRENCY,
    },
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [convertedResult, setConvertedResult] =
    useState<ConvertCurrencyResult | null>(null);

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

  const fromCurrency = useWatch({ control, name: "fromCurrency" });

  const toCurrency = useWatch({ control, name: "toCurrency" });

  // Prevent users from converting the same from and to currency
  const disableConvert = fromCurrency === toCurrency;

  // Format for display and keep the raw API/calculated numbers in state.
  const formatConvertedCurrencyAmount = (
    amount: number,
    currency: CurrencyCode,
  ) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount);

  const clearConvertedResult = () => {
    setConvertedResult(null);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await convertCurrency(data);
      setConvertedResult(result);
    } catch (err) {
      if (err instanceof Error) console.log("err", err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-md p-4 border border-general-border"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="amount">Amount</label>
            <div className="flex items-center rounded-md border border-input-border p-2 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/20">
              <input
                id="amount"
                {...register("amount", {
                  required: "Amount is required",
                  onChange: clearConvertedResult,
                })}
                type="text"
                inputMode="decimal"
                className="w-full bg-transparent text-md outline-none"
              />
              <span className="ml-3 text-xs font-light text-app-text-minimal">
                {fromCurrency}
              </span>
            </div>
            {errors.amount && (
              <p className="text-error text-sm">{errors.amount.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="from-currency">From</label>
            {currencies.length > 0 && (
              <div className="rounded-md border border-input-border p-2 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/20">
                <select
                  id="from-currency"
                  {...register("fromCurrency", {
                    onChange: clearConvertedResult,
                  })}
                  className="w-full bg-transparent text-md outline-none"
                >
                  {currencies.map((currency: Currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="to-currency">To</label>
            {currencies.length > 0 && (
              <div className="rounded-md border border-input-border p-2 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/20">
                <select
                  id="to-currency"
                  {...register("toCurrency", {
                    onChange: clearConvertedResult,
                  })}
                  className="w-full bg-transparent text-md outline-none"
                >
                  {currencies.map((currency: Currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-md border border-input-border bg-button-background p-2 text-button-text font-semibold focus-visible:opacity-80 disabled:border-error disabled:bg-transparent disabled:text-error disabled:cursor-not-allowed hover:opacity-80 "
            disabled={disableConvert}
          >
            CONVERT
          </button>
        </div>

        <section className="flex min-h-24 flex-1 flex-col gap-2 rounded-md border border-general-border py-6 px-2">
          {convertedResult ? (
            <div className="flex flex-col  pb-4">
              <p className="font-semibold text-sm pb-1">Converted amount:</p>
              <p className="font-semibold text-4xl pb-4 border-b border-general-border">
                {formatConvertedCurrencyAmount(
                  convertedResult.convertedAmount,
                  convertedResult.toCurrency,
                )}
              </p>
              <p className="font-semibold text-sm text-app-text-minimal pt-4">
                1 {convertedResult.fromCurrency} ={" "}
                {convertedResult.rate.toFixed(4)} {convertedResult.toCurrency}
              </p>
            </div>
          ) : disableConvert ? (
            <p className="text-error text-sm">
              Please select a different currency to convert
            </p>
          ) : (
            <p className="text-sm text-app-text-minimal">
              Enter an amount, choose two currencies, then press Convert.
            </p>
          )}
        </section>
      </div>
    </form>
  );
};
