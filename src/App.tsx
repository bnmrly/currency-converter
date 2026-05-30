import { CurrencyForm } from "@/components/CurrencyForm/CurrencyForm";
import { Results } from "@/components/Results/Results";

function App() {
  return (
    <main className="border border-gray-400 m-4 rounded-md p-4 bg-yellow-50">
      <header className="text-center pb-4">
        <h1 className="text-3xl font-semibold">Currency Converter</h1>
        <p>Convert currencies instantly with live exchange rates</p>
      </header>
      <div className="flex flex-col gap-4 lg:flex-row">
        <CurrencyForm />
        <Results />
      </div>
    </main>
  );
}

export default App;
