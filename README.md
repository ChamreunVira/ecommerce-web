# E-commerce frontend

This repository contains the customer storefront and staff administration UI
for the e-commerce platform. Customers can browse products, manage a cart,
checkout, review orders, and update their account. Authorized staff can manage
products, inventory, categories, orders, users, promotions, shipping, reviews,
payments, and reports.

The application uses Next.js App Router, React, TypeScript, Tailwind CSS,
Axios, React Hook Form, Zod, and Chart.js.

## Prerequisites

- Node.js 20 or newer
- npm
- A running instance of the backend API

## Getting started

Install dependencies from the project directory:

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_BASE_URL_IMG=http://localhost:8081/api/v1/uploads
```

`NEXT_PUBLIC_BASE_URL` is used for API requests. `NEXT_PUBLIC_BASE_URL_IMG`
should point to the backend upload directory used for product and banner
images. Keep environment files and private credentials out of version control.

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |

## Application routes

### Customer

- `/` - Storefront home page
- `/products` - Product catalogue and product details
- `/cart` - Shopping cart
- `/checkout` - Checkout and payment flow
- `/profile` - Account information and order history
- `/sign-in` and `/sign-up` - Authentication
- `/forgot-password` - Password recovery

### Staff administration

The `/admin` area requires an authenticated user with an appropriate staff or
admin role. It includes dashboards for products, inventory, categories, orders,
users, roles, promotions, shipping, payments, returns, reviews, settings,
reports, banners, and audit logs.

## Project structure

```text
app/          Pages, layouts, and route handlers
components/   Shared UI components and modals
services/     Backend API service modules
lib/          Axios client and shared integrations
types/        TypeScript domain types
utils/        Reusable utilities
public/       Static assets
```

Authenticated API calls are centralized in `lib/axios.ts`. Tokens are managed
by `utils/tokenManager.ts`, and API services in `services/` expose the backend
operations used by the pages and components.

## Backend

The frontend expects the backend to expose the API under `/api/v1` and to serve
uploaded images from the configured image URL. Start the backend before using
catalogue, authentication, cart, checkout, or administration features.

## Useful documentation

- [Next.js documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
