# Architecture

## Top-level architecture

```text
Browser (Next.js App Router UI)
  ├─ Customer routes: app/(user)
  ├─ Authentication routes: app/(auth)
  └─ Admin routes: app/admin
           │
           ▼
    Axios HTTP client + auth interceptor
           │
           ▼
  REST API: http://localhost:8081/api/v1
           │
           ▼
 Database / storage / payment integrations
```

The repository contains the Next.js frontend. The API owns authorization, business invariants, persistence, and audit recording. The browser may improve usability, but it must not be treated as the security boundary.

## Frontend system design

- **Routing:** Next.js App Router. Route groups separate public customer and authentication experiences from admin routes.
- **Rendering:** Pages are server components by default. Add `"use client"` only for browser state, event handlers, effects, or browser-only libraries.
- **Data access:** `lib/axios.ts` exposes the shared Axios instance. It applies the bearer token, attempts one token refresh after `401`, then redirects to sign-in when recovery fails.
- **Reusable UI:** `components/` contains shared tables, forms, modals, navigation, and display components. All data tables use `components/Table.tsx`.
- **Types/contracts:** `types/` holds API and domain shapes. `types/page-response.ts` defines paginated list responses.
- **Constants:** `constant/constant.ts` contains stable domain enums such as order, payment, and audit values.

## Key business flows

### Authentication

1. User submits credentials.
2. API authenticates and issues access/refresh credentials.
3. The access token is stored through `tokenManager` and attached by the Axios request interceptor.
4. On one `401`, the interceptor calls the refresh endpoint and retries the original request.
5. If refresh fails, local credentials are removed and the user is sent to sign-in.

### Admin list and audit flow

1. Page state changes: page, size, sort field, or sort direction.
2. Client requests the API with only that page’s query parameters.
3. API returns `content`, `number`, `size`, `totalPage`, `totalElement`, and navigation flags.
4. UI renders the returned records and derives pagination controls from totals.
5. Audit UI displays page 1 to users while requesting `page=0` from the API.

### Product and inventory safety

1. Operator submits a product/category/inventory mutation.
2. API validates role, input, referential integrity, and inventory constraints in a transaction.
3. API persists the mutation and creates its audit record in the same transaction.
4. UI refreshes affected data and reports success/failure.

### Checkout and order flow

1. Customer selects in-stock items and begins checkout.
2. API verifies product price, discount, stock, and customer input—never trusting browser totals.
3. API creates an order and reserves/decrements stock according to the chosen inventory policy.
4. Payment is initiated/recorded and the order advances only through permitted status transitions.
5. Customer and operators can retrieve the current order state; significant transitions are audited.

## Folder structure

```text
app/                    App Router routes, layouts, global styles
  (auth)/               Sign-in, registration, recovery
  (user)/               Customer storefront and profile
  admin/                Administrative operations
components/             Reusable visual and interaction components
constant/               Domain constants and enums
lib/                    HTTP client and cross-cutting utilities
services/               API-oriented domain service functions
types/                  TypeScript API/domain contracts
utils/                  Small framework-independent helpers
public/                 Static assets
```

## Design methodologies and patterns

- **Feature-oriented routes:** keep page-specific UI and state close to its route; extract only reusable components.
- **Composition over inheritance:** configure shared components with props/columns rather than duplicating markup.
- **Single responsibility:** pages coordinate state and flows; services/HTTP access data; components render interaction/UI.
- **Contract-first integration:** TypeScript models match API request/response contracts; update both deliberately when APIs change.
- **Server-authoritative state:** use API responses as the final source of truth after mutations.
- **Defensive UI:** explicit loading, empty, error, confirmation, and unavailable states.
- **Progressive enhancement:** core content should remain semantic and usable before decorative behavior.

## API conventions

- Base URL: `http://localhost:8081/api/v1` (environment-configurable in production).
- Use JSON request/response bodies and typed DTOs.
- Paginated list response: `content`, `number`, `size`, `totalPage`, `totalElement`, `hasPrevious`, `hasNext`.
- List query parameters use zero-based `page`, plus `size`, `sortBy`, and `ascending` where supported.
- Return predictable success/error envelopes; do not leak stack traces or secrets.
