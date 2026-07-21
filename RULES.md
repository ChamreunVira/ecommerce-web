# Engineering Rules

These rules are mandatory for contributors and AI agents working in this repository.

## Before coding

1. Read `AGENTS.md` and the relevant installed Next.js guide in `node_modules/next/dist/docs/` before changing Next.js code. This project uses Next.js 16 and must not rely on older conventions.
2. Inspect existing components, types, and API contracts before introducing a duplicate pattern.
3. Preserve unrelated working-tree changes. Never reset, checkout, or delete unrelated files.
4. Ask for direction when a change requires a product/security decision that cannot be safely inferred.

## Project structure and naming

- Use App Router conventions: route files live under `app/` and use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` only for their defined roles.
- Components: PascalCase filenames and exports (example: `ProductTable.tsx`).
- Hooks: `useXxx.ts`; utilities/services: kebab-case or the project’s established naming convention; never create duplicate versions of the same module.
- Type/interface/enum names use PascalCase. Variables, functions, and props use camelCase. Constants use UPPER_SNAKE_CASE only for true constants.
- Use explicit domain names (`auditLogs`, `pageSize`, `orderItems`), not vague names (`data`, `value`, `item`) outside short local scopes.

## TypeScript and React

- Type all public component props, API data, state, and function boundaries. Do not introduce `any`.
- Prefer `unknown` plus narrowing for untrusted errors or data.
- Prefer server components. Add `"use client"` only when browser interactivity/hooks are necessary.
- Keep effects for external synchronization. Cancel in-flight browser requests when a component/query changes.
- Do not mutate state, props, or API response objects in place.
- Extract reusable UI only when it has a stable, shared responsibility; avoid premature abstractions.

## UI and accessibility

- Follow `DESIGN.md`. Use shared components before creating page-specific duplicates.
- All data tables use `components/Table.tsx` primitives or the shared generic table component.
- Use semantic HTML and accessible names for interactive controls. Icon-only buttons require `aria-label`.
- Do not rely on color alone for status/error meaning.
- Keep keyboard focus visible and use `role="alert"` for blocking asynchronous errors.
- Validate at the field level and retain user input when a request fails.

## API and data rules

- Use the shared `http` client from `lib/axios.ts`; do not create ad-hoc Axios clients in pages/components.
- API requests and responses must use shared TypeScript contracts in `types/` where applicable.
- Server pagination uses `page`, `size`, `sortBy`, and `ascending`; document whether server pages are zero-indexed. UI pagination must translate explicitly.
- Do not keep production mock data in an API-backed screen. Use controlled fixtures only in isolated development/test paths.
- Never trust client totals, prices, roles, stock, or user IDs for authorization/business decisions.
- Do not log or render passwords, tokens, payment secrets, or unredacted sensitive audit snapshots.

## Security

- Authorization is enforced by the server for every protected operation; hiding a UI element is not security.
- Use least privilege for every role and data query.
- Confirm destructive actions in the UI and audit successful mutations on the server.
- Keep secrets in environment variables, never source code, client bundles, screenshots, or documentation examples.

## Quality gates

- Run the narrowest relevant lint/type/test commands after each change, then broader checks when practical.
- At minimum, changed TypeScript must pass `npx tsc --noEmit` and targeted ESLint checks when repository baseline permits.
- Do not claim a global check passed if unrelated existing failures prevent it; state the exact limitation.
- Use `apply_patch` for code/document edits. Keep diffs focused and avoid unrelated formatting rewrites.
- Update `PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, or `SCHEMA.md` whenever a material product, contract, design, or data-model decision changes.
