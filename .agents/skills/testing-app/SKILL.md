# Testing the gambling-affiliate-site app

A gambling affiliate directory built on Next.js 16 (App Router, no `src/`), Prisma 7 + Neon, NextAuth v5 (Credentials), Cloudinary, shadcn/ui. Main revenue path is affiliate outbound clicks, so every test MUST verify the `target`/`rel` attributes on the Sign up CTA.

## Where the app runs

- **Production:** `https://gambling-affiliate-site.vercel.app` — NOT SSO-protected. Good for post-merge verification.
- **Vercel preview deployments:** protected by Vercel SSO and return HTTP 401 to unauthenticated curls. To verify preview builds either:
  1. Ask the user for a Vercel Protection Bypass token and append `?x-vercel-protection-bypass=<token>` to URLs, OR
  2. Run the PR branch locally (preferred — see below).
- **Local:** `npm run build && PORT=3000 npm start` — the `.env` in the repo already points at the same Neon DB and the same Cloudinary account as prod, so localhost is a faithful stand-in for a preview deploy.

## Seeded test data

- There is always at least one published ad card in the DB (`mostplay`, `betjili` at time of writing) — the homepage grid and a `/casino/<slug>` static page will be generated during `next build`.
- Admin user is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`. Do NOT paste these in chat; they're already on the box.

## Golden-path assertions (what the site must do to be useful)

1. **Affiliate attribute integrity** — every Sign up / Login anchor on `/` and `/casino/<slug>` must be `<a target="_blank" rel="nofollow sponsored noopener noreferrer" href="<affiliate url>">`. Prove via DOM, not visuals.
2. **Admin auth** — `/admin/login` rejects wrong creds with `"Invalid email or password."` and redirects valid creds to `/admin`. If `AUTH_SECRET` is missing on Vercel, valid creds return 500 `MissingSecret`. Always check the prod env has `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` set.
3. **SEO** — `/robots.txt` contains `Disallow: /admin`, `Host:` + `Sitemap:` using `NEXT_PUBLIC_SITE_URL`; `/sitemap.xml` lists the homepage and every published `/casino/<slug>` but never admin paths; home page has `<link rel="canonical">` and `og:url` set to `NEXT_PUBLIC_SITE_URL`.
4. **Cloudinary uploads** — admin form → logo upload returns a URL like `https://res.cloudinary.com/<cloud>/image/upload/…` and the toast shows `"Logo uploaded"`.

## UI-redesign testing playbook

When a PR changes only the visual layer:

1. Run the PR branch locally (`npm install && npm run build && PORT=3000 npm start`).
2. Use CDP + Playwright to collect **DOM evidence**. Chrome exposes CDP on `http://localhost:29229`. Example:
   ```python
   from playwright.async_api import async_playwright
   async with async_playwright() as pw:
     browser = await pw.chromium.connect_over_cdp("http://localhost:29229")
     page = browser.contexts[0].pages[0]
     await page.goto("http://localhost:3000/")
     info = await page.evaluate("""() => ({
       htmlDark: document.documentElement.classList.contains('dark'),
       bodyBg: getComputedStyle(document.body).backgroundColor,
       h1: document.querySelector('h1').textContent.trim(),
       signups: [...document.querySelectorAll('a.btn-casino')].map(a => ({
         text: a.textContent.trim(), href: a.href, target: a.target, rel: a.rel
       }))
     })""")
   ```
3. Assert on specific class names and text strings that only the new UI produces — do not rely on screenshots alone (a visual might look similar while functionality regressed, or vice versa).
4. Also take screenshots (`page.screenshot(full_page=True)`) for the PR comment, but treat them as supporting evidence.

## Recording guidelines

- Record **only** when testing GUI interactions. Skip recording if all you're doing is curl + headless DOM assertions.
- Before recording, maximize the browser window. `wmctrl` is **NOT installed** on the VM by default — use Super+Up or Alt+F10 via the computer tool, or just work with whatever size Chrome opens at.
- Annotate with `computer(action="record_annotate")` using `test_start` / `assertion` pairs so the viewer can follow along.

## Gotchas discovered during development

- **Next.js 16 Turbopack** is the default builder; build can take ~12s.
- Prisma 7 uses the rust-free client under `lib/generated/prisma` — regenerate via `npx prisma generate` if it goes missing.
- The admin dashboard uses Server Actions; posting from curl with cookies is possible but fragile — prefer driving through the browser.
- Card titles on the home grid are **not** links; click a dedicated link (e.g. `<Link>` back-to-all-offers) or navigate directly to `/casino/<slug>`.
- Sign-up clicks open new tabs; in Playwright, listen with `ctx.expect_page()` — but this occasionally times out under CDP. If it does, asserting `target="_blank"` + `rel` on the anchor is equivalent proof.

## Devin Secrets Needed

Only needed if re-deploying or changing env; day-to-day testing uses the existing `.env`:

- `VERCEL_API_TOKEN` — to read/write Vercel env vars or trigger redeploys.
- `DATABASE_URL` — the Neon connection string (already in `.env`).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for Cloudinary uploads (already in `.env`).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — seeded admin (already in `.env`).
- `AUTH_SECRET` — NextAuth JWT signing key (set on Vercel; not needed locally unless you want to match prod).
