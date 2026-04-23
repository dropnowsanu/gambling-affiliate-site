# Gambling Affiliate Site

A SEO-friendly directory of online casinos & sportsbooks built as a Next.js 16
affiliate marketing site. Every casino is shown as a **card** with logo, name,
**welcome offer**, **sign up** and **login** buttons that open the affiliate
link in a new tab (`target="_blank"`, `rel="nofollow sponsored noopener"`).

An admin dashboard at `/admin` lets you create / edit / delete ad cards and
upload logos to Cloudinary.

## Stack

- **Next.js 16** (App Router, no `src/`, Turbopack)
- **React 19**
- **Tailwind v4** + **shadcn/ui**
- **Prisma 7** (rust-free client) + **Neon Postgres** via `@prisma/adapter-pg`
- **NextAuth v5** (Credentials provider, bcrypt)
- **Cloudinary** (signed server-side upload via `/api/upload`)

## Getting started

```bash
pnpm install
cp .env.example .env              # fill in DATABASE_URL, Cloudinary, etc.
pnpm prisma db push                # create schema in Neon
pnpm db:seed                       # create admin user from ADMIN_EMAIL / ADMIN_PASSWORD
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin at
[http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon / Postgres connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Public URL of the app (e.g. `https://yoursite.com`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials seeded for the first admin |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary server credentials |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name exposed to the client (optional) |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for `metadataBase`, canonical URLs, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | Brand name shown in the header / metadata |

## SEO

- `app/layout.tsx` sets `metadataBase`, Open Graph and Twitter metadata.
- `app/sitemap.ts` generates `/sitemap.xml` from published ad cards.
- `app/robots.ts` generates `/robots.txt` (blocks `/admin` and `/api`).
- Per-card pages at `/casino/[slug]` get per-page metadata and JSON-LD `ItemList`
  structured data on the home page.
- Affiliate links use `rel="nofollow sponsored noopener noreferrer"`.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm db:generate` | `prisma generate` |
| `pnpm db:push` | Push schema to Neon (no migration history) |
| `pnpm db:migrate` | Create & apply a migration |
| `pnpm db:seed` | Seed the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

## Responsible gaming

This project advertises third-party gambling operators. The site footer
includes a 18+ responsible-gaming disclaimer. You should also comply with
advertising regulations for each jurisdiction you target.
