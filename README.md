# Financy

A full-stack personal finance management application for transactions and categories.

- **Backend**: Node.js + TypeScript + GraphQL (Apollo Server + Express) + Prisma + SQLite
- **Frontend**: React + Vite + TypeScript + Apollo Client + Tailwind CSS

Reference design: [Figma — Financy (Community)](https://www.figma.com/design/JMbfJJmuGwmxIjOjAhLz7B/Financy--Community-)

## Project structure

```text
financy/
├── backend/     # GraphQL API
└── frontend/    # React SPA
```

## Prerequisites

- Node.js **18+** (20+ recommended; tested with Node.js 22)
- npm

## Backend setup

```bash
cd backend
npm install
cp .env.example .env        # change JWT_SECRET if desired
npm run prisma:migrate      # creates the SQLite database and applies migrations
npm run seed                # seeds a test user, categories, and transactions
npm run dev                 # starts the API at http://localhost:4000/graphql
```

Test user created by the seed script:

- **Email**: `teste@financy.com`
- **Password**: `123456`

Other available scripts: `npm run build` / `npm start` for production builds and `npm run prisma:studio` to inspect the database with Prisma Studio.

## Frontend setup

In another terminal, with the backend already running:

```bash
cd frontend
npm install
cp .env.example .env        # already points to http://localhost:4000/graphql
npm run dev                 # starts the app at http://localhost:5173
```

Open `http://localhost:5173`, sign in with the test user (or create a new account), and explore the Dashboard, Transactions, Categories, and Profile pages.

## Technical decisions and resolved ambiguities

The main decisions made while resolving ambiguous requirements are listed below:

1. **`amount` stored in cents (`Int`)**: SQLite through Prisma is not compatible with `Decimal`. Monetary values are always transferred through the API as integer cents; the frontend converts them to `R$ 0.000,00` for display and back to cents when submitting forms (`src/lib/formatCurrency.ts`).
2. **Prisma enums represented as `String` fields**: Prisma's SQLite connector does not support native enums (`P1012` error). `CategoryColor` and `TransactionType` remain enums in the **GraphQL** schema and are also validated with Zod in the resolvers, while the corresponding columns in `schema.prisma` are strings. This does not change the API contract.
3. **Deleting a category linked to transactions**: deletion is blocked and returns `CATEGORY_HAS_TRANSACTIONS`. This prevents financial data loss without explicit confirmation.
4. **`FORBIDDEN` vs. `NOT_FOUND`**: when a user tries to edit or delete an existing resource owned by someone else, the API returns `FORBIDDEN` instead of disguising it as a 404 response. A nonexistent `id` returns `NOT_FOUND`. The frontend handles both cases gracefully.
5. **`updateProfile` mutation**: profile editing requires users to update their name, email, and password, so this mutation was added as a natural extension of the `auth` module. It follows the same validation and error-handling patterns as the other mutations.
6. **bcryptjs instead of bcrypt**: this avoids compiling a native binary in the development environment, particularly on Windows, while providing the same API and algorithm.
7. **Apollo Client pinned to v3 (`^3.11.10`)**: v4 reorganized the package entry points, removing `useQuery`, `useMutation`, and `ApolloProvider` from the root export. Version 3 is stable, widely documented, and fully meets the project's requirements.
8. **React pinned to 18.3.1**: the official Vite template installed React 19 by default. The project uses React 18 to maintain broad compatibility with the selected ecosystem, including Apollo Client v3 and Radix UI.
9. **Accessible dialogs built with Radix UI (`@radix-ui/react-dialog`)** instead of the complete shadcn/ui CLI: this uses the same Radix foundation without requiring an interactive installer. Visual components such as `Input`, `Button`, and `Tag` were implemented directly using the project's design tokens.
10. **Transaction pagination**: transactions are displayed 10 items per page through `transactions(page, perPage)`. The `Pagination` component shows an “X to Y | Z results” counter.
11. **JWT expiration**: tokens expire after seven days. When a token expires, the API returns `UNAUTHENTICATED`, and the frontend automatically clears the session and redirects the user to the Login page through Apollo's `onError` link.

## Optional enhancements

Optional features such as real avatar uploads were not implemented on `main` because they are outside the required scope. The avatar displayed on the Profile page uses the user's initials.

## Known limitations

- Visual fidelity was implemented using the project's color, typography, and icon tokens, along with the functional description of each screen. An automated pixel-by-pixel browser comparison was not possible in this environment. A manual visual review against the Figma frames is recommended before final delivery.
