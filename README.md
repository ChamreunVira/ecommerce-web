# E-commerce frontend

The frontend for the e-commerce platform. It provides the customer storefront,
authentication and checkout flows, account pages, and an admin dashboard for
managing products, categories, banners, promotions, orders, users, and reports.

It is built with Next.js App Router, React, TypeScript, Tailwind CSS, Axios,
React Hook Form, Zod, and Chart.js.

## Requirements

- Node.js 20 or newer
- npm
- The Spring Boot API running locally or at a reachable URL

## Setup

From this directory (`ecommerce/ecommerce`):

```bash
npm install
```

Create `.env.local` with values for the API:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_BASE_URL_IMG=http://localhost:8081/api/v1/uploads
NEXT_PUBLIC_GOOGLE_API_KEY=your-public-key
```

Do not commit `.env.local` or private credentials. The API URL must include the
backend context path `/api/v1`.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production build   |
| `npm run lint`  | Run ESLint                   |

## Main routes

- `/` - Storefront home page
- `/sign-in` and `/sign-up` - Authentication
- `/products` - Product browsing and details
- `/cart` and `/checkout` - Cart and checkout
- `/profile` - Customer profile and orders
- `/admin` - Admin dashboard
- `/admin/product`, `/admin/order`, `/admin/user` - Administration screens

The frontend sends authenticated requests through `lib/axios.ts`. Access and
refresh tokens are handled by the shared token manager and API interceptor.

## Project structure

```text
app/          App Router pages and layouts
components/   Shared UI and modal components
services/     API service modules
lib/          Shared clients and integrations
types/        TypeScript domain types
utils/        Reusable utilities
public/       Static assets
```

## Related project

The backend lives in `../ecommerce-api`. See its README for PostgreSQL,
Spring Boot, API, and Docker setup instructions.

## Next.js documentation

- [Next.js documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
