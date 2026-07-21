# Database Schema and Data Contract

> This is the target relational schema for the API that serves this frontend. Confirm exact column types and migration syntax against the backend repository before implementation.

## ERD

```text
users ──< user_roles >── roles
  │  ├──< orders ──< order_items >── products >── categories
  │  ├──< audit_logs
  │  └──< reviews >── products
products ──< product_images
products ──< inventory_movements
orders ──1 payments
orders ──< shipments
orders ──< returns
promotions ──< promotion_redemptions >── orders
```

## Core tables

| Table | Primary key | Important columns |
| --- | --- | --- |
| `users` | `id` | `email` (unique), `full_name`, `password_hash`, `status`, timestamps |
| `roles` | `id` | `name` (unique) |
| `user_roles` | (`user_id`, `role_id`) | user/role assignment |
| `categories` | `id` | `name`, `description`, `status`, timestamps |
| `products` | `id` | `category_id`, `name`, `description`, `price`, `discount`, `qty`, `status`, timestamps |
| `product_images` | `id` | `product_id`, `path`, `sort_order`, `alt_text` |
| `orders` | `id` | `user_id`, `order_code` (unique), totals, address snapshot, `status`, timestamps |
| `order_items` | `id` | `order_id`, `product_id`, product/price/quantity snapshots |
| `payments` | `id` | `order_id`, `method`, `amount`, `status`, provider reference, timestamps |
| `shipments` | `id` | `order_id`, carrier, tracking number, destination, status, delivery timestamps |
| `returns` | `id` | `order_id`, `order_item_id`, reason, amount, status, timestamps |
| `promotions` | `id` | code (unique), type, value, limits, validity, status |
| `promotion_redemptions` | `id` | `promotion_id`, `order_id`, `user_id`, redeemed timestamp |
| `reviews` | `id` | `user_id`, `product_id`, rating, comment, status, timestamps |
| `inventory_movements` | `id` | `product_id`, delta, reason, reference type/id, actor, timestamp |
| `audit_logs` | `id` | action, module, entity_id, actor, IP, detail/value snapshots, timestamp |

## Required constraints and indexes

- `users.email`, `orders.order_code`, and `promotions.code` are unique, case-insensitively where the database supports it.
- Monetary amounts use `DECIMAL/NUMERIC`, never floating point.
- Quantity/count fields are non-negative integers; discounts have an explicit allowed range.
- Foreign keys use restrictive deletion by default. Delete/cascade behavior must be consciously selected per relationship.
- Index every foreign key and common lookup: `products(category_id)`, `orders(user_id, created_at)`, `order_items(order_id)`, `audit_logs(timestamp)`, and `audit_logs(module, entity_id)`.
- Audit list index: `(timestamp DESC, id DESC)` and/or the exact fields permitted by the audit sort contract.

## Audit log model

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint | Primary key |
| `action` | enum/string | `CREATE`, `UPDATE`, `DELETE`, `VIEW`, `LOGIN`, etc. |
| `module` | enum/string | `PRODUCT`, `ORDER`, `CATEGORY`, `USER`, etc. |
| `entity_id` | varchar | Nullable when no entity can be identified |
| `performed_by` | varchar | Actor identity/display value |
| `role` | varchar | Actor role at time of event |
| `ip_address` | inet/varchar | Request origin |
| `timestamp` | timestamptz | UTC event timestamp |
| `details`, `reason` | text | Human-readable context |
| `old_values`, `new_values` | json/jsonb or text | Redacted change snapshots |

Never store raw passwords, access tokens, refresh tokens, payment secrets, or full sensitive personal data in audit snapshots. Redact values before persistence.

## Row-level security (RLS) policy intent

RLS is required when clients connect directly to the database/service. If only a trusted API connects to the database, enforce the same policy centrally in API authorization.

| Resource | Customer policy | Staff/admin policy |
| --- | --- | --- |
| Products/categories | Read active records | Manage according to role |
| Orders/order items | Read only own orders | Read/manage assigned or authorized scope |
| Payments | Read only payment summary for own order | Authorized finance/admin access |
| Reviews | Create/manage own review subject to rules | Moderate |
| Users | Read/update own profile only | Authorized user administration |
| Audit logs | No direct customer access | Read-only for authorized audit/admin roles |
| Inventory movements | No direct customer access | Authorized inventory/admin roles |

Use authenticated user identity from the session/JWT, not a client-provided user ID, in every RLS predicate.

## Migration rules

1. Create migrations in chronological, immutable files: `YYYYMMDDHHMM_description`.
2. Each migration must be safe for existing data or provide an explicit backfill plan.
3. Add nullable columns first, backfill, validate, then add `NOT NULL` when needed.
4. Create indexes concurrently/online when supported for large production tables.
5. Every production migration requires a tested rollback or a documented forward-fix strategy.
6. Schema migrations that affect API contracts require matching DTO/type, API, and UI updates in the same change set.

## Application models

- API DTOs use camelCase JSON fields (`performedBy`, `totalElement`, `createdAt`).
- Database columns may use snake_case; map them explicitly in the persistence layer.
- Models expose only what the caller needs. Password hashes, tokens, provider payloads, and private audit data are never serialized to normal client responses.
