# Alap Admin

Admin console with dashboard metrics, user search, account access controls, session revocation, and system health.

## Local setup

Set `API_BASE_URL` in `.env` (see `.env.example`), install dependencies with `yarn`, and run `yarn dev`.

## Structure

- `src/app`: routes and layouts
- `src/features`: domain components, actions, and types
- `src/components/layout`: shared navigation and headers
- `src/lib`: API transport
- `src/utils`: shared helpers

The `@/` alias resolves to `src/`. User profiles currently use the first 100 accounts from the user list endpoint.

Browser API requests use `/api/v1`; Next.js forwards them to `API_BASE_URL`. Restart the dev server after changing `.env`.
