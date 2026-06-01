import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { getCurrencies } from "@/utils";

import { CurrencyForm } from "./CurrencyForm";

jest.mock("@/utils", () => ({
  convertCurrency: jest.fn(),
  getCurrencies: jest.fn(),
}));

const mockedGetCurrencies = jest.mocked(getCurrencies);

describe("CurrencyForm", () => {
  beforeEach(() => {
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
});
