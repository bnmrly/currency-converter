import { CurrencyForm } from "@/components/CurrencyForm/CurrencyForm";

function App() {
  return (
    <main className="m-4 rounded-md p-4 bg-app-surface">
      <header className="text-center pb-4">
        <h1 className="text-3xl font-semibold pb-2">Currency Converter</h1>
        <p className="text-accent">
          Convert currencies instantly with live exchange rates
        </p>
      </header>
      <CurrencyForm />
    </main>
  );
}

export default App;
