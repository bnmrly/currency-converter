import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { convertCurrency, getCurrencies } from "@/utils";

import { CurrencyForm } from "./CurrencyForm";

jest.mock("@/utils", () => ({
  getCurrencies: jest.fn(),
  convertCurrency: jest.fn(),
}));

const mockedGetCurrencies = jest.mocked(getCurrencies);
const mockedConvertCurrency = jest.mocked(convertCurrency);

describe("CurrencyForm", () => {
  beforeEach(() => {
    mockedGetCurrencies.mockReset();
    mockedConvertCurrency.mockReset();

    mockedGetCurrencies.mockResolvedValue([
      { value: "GBP", label: "British Pound" },
      { value: "EUR", label: "Euro" },
    ]);
  });

  it("renders the form controls", async () => {
    render(<CurrencyForm />);

    expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe(
      "100",
    );
    expect(await screen.findByLabelText(/from/i)).toBeTruthy();
    expect(screen.getByLabelText(/to/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /convert/i })).toBeTruthy();
  });

  it("loads currencies into the from and to selects", async () => {
    render(<CurrencyForm />);

    const fromCurrencySelect = (await screen.findByLabelText(
      /from/i,
    )) as HTMLSelectElement;
    const toCurrencySelect = screen.getByLabelText(/to/i) as HTMLSelectElement;

    expect(
      Array.from(fromCurrencySelect.options).map((option) => option.text),
    ).toEqual(["British Pound", "Euro"]);
    expect(
      Array.from(toCurrencySelect.options).map((option) => option.text),
    ).toEqual(["British Pound", "Euro"]);
  });

  it("shows an error when the amount is empty", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.clear(screen.getByLabelText(/amount/i));
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(await screen.findByText("Amount is required")).toBeTruthy();
  });

  it("shows an error when the amount is not a number", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "99jj");
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(await screen.findByText("Amount must be a number")).toBeTruthy();
  });

  it("shows an error when the amount is zero", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "0");
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(
      await screen.findByText("Amount must be greater than 0"),
    ).toBeTruthy();
  });

  it("shows an error when the amount has more than two decimal places", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "10.123");
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(
      await screen.findByText("Amount can only have 2 decimal places"),
    ).toBeTruthy();
  });

  it("shows an error when the amount is above the maximum", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "1000000001");
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(
      await screen.findByText("Amount must be 1,000,000,000 or less"),
    ).toBeTruthy();
  });

  it("calls convertCurrency with the selected form values", async () => {
    const user = userEvent.setup();

    mockedConvertCurrency.mockResolvedValue({
      amount: 100,
      convertedAmount: 115,
      fromCurrency: "GBP",
      toCurrency: "EUR",
      rate: 1.15,
      date: "2026-06-01",
    });

    render(<CurrencyForm />);
    await screen.findByLabelText(/from/i);
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(mockedConvertCurrency).toHaveBeenCalledWith({
      amount: "100",
      fromCurrency: "GBP",
      toCurrency: "EUR",
    });
  });

  it("shows the converted result after a successful conversion", async () => {
    const user = userEvent.setup();

    mockedConvertCurrency.mockResolvedValue({
      amount: 100,
      convertedAmount: 115,
      fromCurrency: "GBP",
      toCurrency: "EUR",
      rate: 1.15,
      date: "2026-06-01",
    });

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.click(screen.getByRole("button", { name: /convert/i }));

    expect(await screen.findByText("Converted amount:")).toBeTruthy();
    expect(screen.getByText("€115.00")).toBeTruthy();
    expect(screen.getByText("1 GBP = 1.1500 EUR")).toBeTruthy();
    expect(screen.getByText("As of 1 Jun 2026")).toBeTruthy();
  });

  it("disables convert when the same currency is selected twice", async () => {
    const user = userEvent.setup();

    render(<CurrencyForm />);

    await screen.findByLabelText(/from/i);
    await user.selectOptions(screen.getByLabelText(/to/i), "GBP");

    expect(
      (screen.getByRole("button", { name: /convert/i }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      screen.getByText("Choose two different currencies to convert"),
    ).toBeTruthy();
  });
});
