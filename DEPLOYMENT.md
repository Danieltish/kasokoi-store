# Deployment Guide

Production target: **Vercel** (functions in `fra1` / Frankfurt) + **Supabase Postgres** (`eu-central-1`).
The storefront is WhatsApp-first, so there is no payment provider to configure yet.

---

## 1. Prerequisites

- GitHub repo: `https://github.com/Danieltish/kasokoi-store`
- Supabase project (already created)
- Vercel account

`vercel.json` pins the app to the Frankfurt region to sit next to Supabase.

---

## 2. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production and Preview).

| Variable | Value / notes |
|---|---|
| `DATABASE_URL` | Supabase **transaction pooler** URI, port `6543` |
| `DIRECT_URL` | Supabase **session pooler** URI, port `5432` (migrations/seed) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.co.ke` (use the Vercel URL until the domain is live) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254717376964` (digits only) |
| `AUTH_SECRET` | `openssl rand -base64 32` — unique, never committed |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret key** — server-only, never expose |
| `SUPABASE_STORAGE_BUCKET` | `product-images` (created and made public on first upload) |

`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD` are **only used by seed scripts**, not at runtime. Keep them in your local `.env`; you do not need them in Vercel.

Changing `AUTH_SECRET` invalidates all admin sessions.

---

## 3. Prepare the production database

Run these locally with the production `DIRECT_URL` in `.env`:

```bash
npx prisma db push        # create/update tables
npm run seed:admin        # create the superadmin only
# optional: npm run seed  # demo categories/products/zones (skip for real launch)
```

Vercel runs `npm ci`, which triggers `postinstall: prisma generate`. The build also queries the
database to prerender the catalog, so `DATABASE_URL` must be reachable during the build.

---

## 4. Deploy on Vercel

1. Go to <https://vercel.com/new> and import `Danieltish/kasokoi-store`.
2. Framework preset: **Next.js** (auto-detected). Root directory: `./`.
3. Keep the default install (`npm ci`) and build (`next build`) commands.
4. Add the environment variables from section 2.
5. Deploy.

CLI alternative:

```bash
npx vercel login
npx vercel --prod
```

---

## 5. Post-deploy verification

| Check | Expected |
|---|---|
| `/` | Home with categories and products |
| `/products`, `/category/networking-equipment`, `/product/<slug>` | Render with filters |
| `/search?q=yeastar` | Returns matching products |
| `/admin/login` → sign in | Redirects to `/admin` |
| `/admin/products`, `/admin/orders` | Load with session |
| `/api/health` | `{"status":"ok","database":"up"}` |
| Place a test order | Order created, confirmation page + WhatsApp link |
| `/sitemap.xml`, `/robots.txt` | Present; `/admin`, `/checkout`, `/order` disallowed |

---

## 6. Domain

1. Vercel → **Domains** → add `kasokoistore.co.ke` (or your domain).
2. Point DNS (A / CNAME) as instructed by Vercel.
3. Update `NEXT_PUBLIC_SITE_URL` to `https://<domain>` and redeploy so metadata, sitemap and
   canonical URLs use the final domain.

---

## 7. Security checklist

- [ ] Rotate the Supabase **database** password and the **superadmin** password (both were shared in chat).
- [ ] Update `DATABASE_URL` / `DIRECT_URL` after rotating the DB password.
- [ ] Use a fresh `AUTH_SECRET` in production.
- [ ] Confirm `.env` is not in git (`git ls-files | grep env`).
- [ ] Keep the Supabase secret key out of the app — Prisma connects with the database password.
- [ ] Enable Supabase backups; take a manual backup before launch.
- [ ] Add uptime monitoring on `/api/health`.
- [ ] Before real payments: add login rate limiting and a proxy-level `/admin` redirect.

---

## 8. Migrations (before real launch)

The project currently uses `prisma db push`. Before launch, switch to versioned migrations:

```bash
npx prisma migrate dev --name init     # requires a shadow database; run once
npx prisma migrate deploy              # production
```

Commit the generated `prisma/migrations/` folder so `migrate deploy` works from CI or Vercel.

---

## 9. Known limitations at launch

- Online payments are **not enabled** yet (Phase 5: M-Pesa + cards).
- Legal pages (Privacy, Terms, Shipping & Returns) are pending (Phase 6).
- Product images are SVG placeholders; Cloudinary is pre-configured in `next.config.ts` for real uploads.
- Cached catalog pages revalidate on admin edits via cache tags, but the first request after an
  edit may briefly serve stale content.
