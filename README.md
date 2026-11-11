# Kasokoi Store — E-Commerce Plan

Mobile-first general store for Kenya. **WhatsApp-first ordering** (+254 717 376 964) with optional M-Pesa and card payments. Broad catalog — phones, electronics, appliances, fashion, beauty, groceries, farm and livestock supplies — KES pricing, Nairobi pickup + nationwide courier.

---

## Quick Start

**Prerequisites:** Node.js 22+, npm, and a PostgreSQL database (Neon, Supabase or local).

```bash
npm install                 # installs deps and runs prisma generate
cp .env.example .env        # then set DATABASE_URL
npm run db:push             # create tables (or: npm run db:migrate)
npm run seed                # seed categories and sample products
npm run dev                 # http://localhost:3000
```

**Scripts**

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run test` | Run property-based unit tests (Vitest + fast-check) |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push schema to the database (no migration) |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed` | Seed categories and sample products |
| `npm run seed:admin` | Create/refresh only the superadmin (production-safe) |
| `npm run seed:categories` | Add broad categories and move products off legacy categories (production-safe) |
| `npm run seed:services` | Add the 5 service categories and 20 services (production-safe) |

> Prisma 7 uses the `prisma-client` generator (`src/generated/prisma`, git-ignored) with the `@prisma/adapter-pg` driver adapter. Client singleton: `src/lib/prisma.ts`.

**Implemented so far**
- **Phase 0** — Next.js 16 scaffold, Prisma 7 + Supabase, design tokens, CI
- **Phase 1** — catalog, category/product pages, search, SEO, seed data
- **Phase 2** — cart (localStorage), checkout, delivery zones/fees, order creation and WhatsApp handoff
- **Phase 3** — multi-admin panel: secure login, roles (superadmin/staff), product, category, order and delivery-zone management, password change
- **Phase 4** — production readiness: security headers, `/api/health`, Vercel region config and a [deployment guide](./DEPLOYMENT.md)

**Customer accounts:** optional registration and login at `/register` and `/login`. Guests can still browse, check out and order on WhatsApp without an account. Sessions last 30 days on the same device.

**Admin panel:** `/admin` (redirects to `/admin/login` when signed out). The initial superadmin is created by `npm run seed` from `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`. Superadmins can add staff or promote an existing customer account at `/admin/admins`. Only the store owner (`OWNER_EMAIL`, default `tishtitoh@gmail.com`) can create another superadmin.

---

## Table of Contents
1. [Vision & Scope](#1-vision--scope)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Data Model](#4-data-model)
5. [Storefront Features](#5-storefront-features)
6. [WhatsApp Ordering Flow](#6-whatsapp-ordering-flow)
7. [Payments](#7-payments)
8. [Delivery & Fulfilment](#8-delivery--fulfilment)
9. [Admin Panel](#9-admin-panel)
10. [Kenya Compliance](#10-kenya-compliance)
11. [Phases & Timeline](#11-phases--timeline)
12. [Testing & Launch Checklist](#12-testing--launch-checklist)
13. [Costs](#13-costs)
14. [Open Decisions](#14-open-decisions)

---

## 1. Vision & Scope

**Goal:** Sell electronic products in Kenya through a fast, mobile-friendly storefront where customers can order directly on WhatsApp and optionally pay online.

**In scope (v1 – MVP):**
- Product catalog with categories, brands, filters, search
- Cart and checkout with customer + delivery details
- WhatsApp order handoff (primary conversion path)
- Optional M-Pesa STK Push + card payments
- Admin panel for products, orders, delivery zones, settings
- Delivery zones (Nairobi + nationwide) and pickup
- Static pages: About, Contact, Shipping & Returns, Privacy, Terms

**Out of scope (v1):**
- Multi-vendor marketplace, commissions, seller payouts
- Wishlists and product reviews
- Automated WhatsApp Business API messaging
- Advanced inventory/warehouse management

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui + Lucide icons |
| Database | PostgreSQL (Neon or Supabase) |
| ORM | Prisma |
| Auth | Auth.js (admin credentials/OTP); customer accounts optional |
| Validation | Zod + React Hook Form |
| Images | Cloudinary / UploadThing |
| Email | Resend |
| M-Pesa | Safaricom Daraja (STK Push) |
| Cards | IntaSend / Flutterwave hosted checkout |
| Hosting | Vercel + Neon |
| Monitoring | Sentry, Vercel Analytics, GA4, Meta Pixel |

**Rationale:** ISR/SSG product pages for SEO, fast mobile performance, one codebase for storefront + admin.

---

## 3. Architecture

```
Browser (mobile-first)
   │
   ├── Next.js App Router (Vercel)
   │     ├── Storefront (RSC + ISR)
   │     ├── Admin (/admin, role-guarded)
   │     └── API routes / webhooks
   │
   ├── PostgreSQL (Neon) ── Prisma
   ├── Cloudinary (images)
   ├── Resend (email)
   ├── Daraja / IntaSend (payments + callbacks)
   └── WhatsApp deep link (wa.me)
```

---

## 4. Data Model

- **Product** — slug, name, brand, description, `specs Json`, priceKes, compareAtPrice, sku, stock, categoryId, images[], condition, isActive
- **Category** — name, slug, image, parentId
- **Order** — orderNumber, customerName, phone, email, county, address, deliveryZoneId, notes, subtotal, deliveryFee, total, status, paymentStatus, paymentMethod, channel
- **OrderItem** — productId, name/price snapshot, qty
- **Payment** — orderId, provider, providerRef, amount, status, rawPayload
- **DeliveryZone** — name, counties[], fee, freeOverThreshold
- **AdminUser** — role (admin/staff)
- **Setting** — store config, WhatsApp number, hours

**Order statuses:** `pending → confirmed → packed → out_for_delivery → delivered` (+ `cancelled`, `returned`)
**Payment statuses:** `unpaid → pending → paid → failed → refunded`

Order items store snapshots so price changes never rewrite history.

---

## 5. Storefront Features

- **Home** — hero, category tiles, featured/deals, trust badges, WhatsApp CTA
- **Category/Listing** — brand, price, condition filters; sort; pagination
- **Product Detail** — gallery, specs, stock badge, add-to-cart, WhatsApp button, related products, Product/Offer schema
- **Search** — Postgres `ILIKE`/trigram (sufficient for <100 items)
- **Cart** — drawer + page, quantity edits, persisted client-side
- **Checkout** — name, phone, county, address, delivery fee, pickup option, WhatsApp or Pay
- **Order Confirmation** — order number, summary, status lookup (order no. + phone)
- **Static Pages** — About, Contact, Shipping & Returns, Warranty, Privacy, Terms
- **Floating WhatsApp button** site-wide

---

## 6. WhatsApp Ordering Flow

1. Cart builds a structured message:
   ```
   Hi Kasokoi, I'd like to order:
   1. Samsung 43" TV x1 — KES 45,000
   ...
   Total: KES 45,000
   Order: KS-10234
   ```
2. Link: `https://wa.me/254717376964?text=<encoded>`
3. Server creates a `pending` order (`channel=whatsapp`) so it appears in admin.
4. "WhatsApp click" tracked as conversion in GA4/Meta Pixel.

*Later:* WhatsApp Business Cloud API for automated confirmations.

---

## 7. Payments

**M-Pesa (Daraja STK Push):**
- Sandbox → production: Consumer Key/Secret, Shortcode, Passkey, public HTTPS callback
- STK Push → callback → verify amount + `CheckoutRequestID` → mark paid (idempotent)
- Reconcile C2B confirmations; store raw payload; manual "mark paid" fallback

**Cards:** IntaSend/Flutterwave hosted checkout (also covers M-Pesa in one integration).
*Tradeoff:* direct Daraja is cheapest but ~1 week more work; aggregator is faster with ~2.9–3.5% + fixed fee. **v1 recommendation: IntaSend.**

**Security:** verify webhooks, idempotency keys, never store card data (SAQ-A), TLS everywhere.

---

## 8. Delivery & Fulfilment

- Zones: Nairobi flat fee (free over threshold), Pickup (Nairobi), Nationwide per-zone fee
- Admin sets fees, marks dispatched, adds courier/tracking note
- Delivery included in cart, checkout summary and WhatsApp message

---

## 9. Admin Panel

`/admin` (role-based): dashboard, product CRUD + images + stock, categories, orders (filter/status/invoice), delivery zones, payments log, settings (WhatsApp number, hours, thresholds), basic reports.

---

## 10. Kenya Compliance

- **Data Protection Act 2019** — privacy policy, lawful basis, ODPC registration if applicable, deletion path
- **KRA eTIMS** — VAT invoices if VAT-registered; generate PDFs now, integrate eTIMS when required
- Consumer protection — clear KES pricing, warranty/returns policy, genuine-product guarantee
- `+254` phone validation; M-Pesa phone defaults to order phone

---

## 11. Phases & Timeline

| Phase | Deliverable | Est. |
|---|---|---|
| 0 | Repo, Next.js 16 + Prisma 7 + Neon, design tokens, env, CI | 2–3 days |
| 1 | Catalog, categories, product pages, search, SEO | 1 wk |
| 2 | Cart, checkout, WhatsApp handoff, order creation | 4–5 days |
| 3 | Admin: products, orders, zones, settings | 1 wk |
| 4 | **Launch milestone** — WhatsApp-first store live | — |
| 5 | M-Pesa STK Push + card gateway + webhooks | 1–1.5 wk |
| 6 | Invoices, legal pages, analytics, polish | 4 days |
| 7 | QA (Playwright, mobile), deploy, launch | 1 wk |

**Recommended early launch:** Phases 0–3 (WhatsApp-first, no online payments) in ~3 weeks, validate demand, then add payments.

---

## 12. Testing & Launch Checklist

- Unit (Zod/price logic) + E2E (browse → cart → checkout → WhatsApp; payment webhook)
- Mobile-first performance, Lighthouse ≥90, optimized images, ISR
- SEO: metadata, sitemap, robots, Product/Breadcrumb/LocalBusiness schema
- Backups (Neon PITR), rate limiting (Upstash), Sentry, uptime monitoring
- Daraja sandbox → production with a live KES 1 test transaction

---

## 13. Costs

Domain `.co.ke` ~KES 1,000–1,500/yr · Vercel/Neon free–$20/mo · Cloudinary free tier · Daraja free (txn fees apply) · Card gateway ~3% per txn.

---

## 14. Open Decisions

1. Store brand name/logo — "Kasokoi Store"?
2. Payment aggregator (IntaSend) vs direct Daraja
3. Launch categories (TVs, phones, laptops, audio, accessories, appliances?)
4. Pickup address + exact delivery fee amounts
5. VAT-registered? (affects pricing display & eTIMS)
