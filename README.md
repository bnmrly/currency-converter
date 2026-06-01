# Currency Converter

A small React currency converter built with Vite. It fetches available currencies and live exchange rates from the Frankfurter API, validates user input with Zod, and displays the converted result in a simple responsive form.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Format files:

```bash
npm run format
```

Check formatting without changing files:

```bash
npm run format:check
```

Preview a production build:

```bash
npm run preview
```

## Tech Stack

- **React 19** for the UI.
- **Vite 8** for local development and production builds.
- **TypeScript** for static typing.
- **Tailwind CSS 4** for styling.
- **React Hook Form** for form state and submit handling.
- **Zod** for form validation and runtime API response validation.
- **@hookform/resolvers** to connect Zod validation to React Hook Form.
- **TanStack React Query** is installed and is a good candidate for the next data-fetching refactor.
- **Frankfurter API** for currency lists and exchange rates.

## Current Behaviour

- Users can enter an amount, choose source and target currencies, and convert between them.
- Amount validation rejects empty values, non-decimal text, scientific notation, negative numbers, zero, values over `1,000,000,000`, and more than two decimal places.
- API responses are parsed with Zod before the app uses them.
- The convert button is disabled when the source and target currencies are the same.

## TODO

- Move currency loading and conversion requests to TanStack React Query.
- Add user-facing API and network error messages.
- Add loading states
- Prevent duplicate conversion submits
