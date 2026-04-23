# Test plan — casino-themed UI redesign (PR #3)

Target: `http://localhost:3000` (production build of the PR branch running against the same Neon DB as prod).
Reason for localhost: the Vercel preview URL is protected by Vercel SSO and returns HTTP 401 without a bypass token. Running `next build && next start` on the PR branch against the same `.env` is a faithful stand-in for the prod bundle.

PR: https://github.com/dropnowsanu/gambling-affiliate-site/pull/3 — base `devin/1776873782-gambling-affiliate-site` (this repo's default branch), CI 2/2 green.

## What changed (in user-visible terms)

The public UI was reskinned from a light/minimal look into a dark casino theme with neon pink/purple/gold gradient accents, glow-y cards, and a big gradient hero. All functionality (routes, affiliate links, SEO endpoints, admin auth) is unchanged.

## Primary flow — prove the new UI actually renders

| # | Action | Pass criteria |
|---|---|---|
| 1 | Navigate to `/`. | Body background is **dark** (near-black indigo, not white). Hero eyebrow chip reads exactly **"Hand-picked & verified"** — text unique to the new `app/page.tsx:71`. H1 contains the two strings **"The hottest online casinos,"** and **"ranked by real bonuses"** (the second span has the `gradient-text` class, `app/page.tsx:74-77`). Header shows a gradient dice-icon logo (new `components/site-header.tsx:13-14`). Chips **"live offers"**, **"Updated daily"**, **"Licensed operators only"** visible. — Old hero said "The best online casinos, ranked by real welcome bonuses" and the page was light-themed, so this sequence looks identical only if the new UI loaded. |
| 2 | Scroll to the offers grid. | At least one `<article class="card-casino ...">` (new class, see `components/ad-card.tsx:23`). Inside the card: a purple/gold-tinted panel labelled **"Welcome offer"** (all caps, from `components/ad-card.tsx:64-66`). The card's primary button is an `<a>` with class that contains **`btn-casino`** (new gradient CTA) and text **"Sign up"**; the secondary button contains class **`btn-ghost-casino`** and text **"Login"**. Old UI used shadcn `Button` variants; neither class existed, so presence of both is proof the new card component rendered. |
| 3 | Right-click the Sign up anchor → Inspect (or evaluate via DevTools Elements). | Anchor has `target="_blank"` and `rel="nofollow sponsored noopener noreferrer"`. `href` is the casino's affiliate URL (starts with `http`). This proves the UI refactor did **not** regress the monetisation attributes. |
| 4 | Click Sign up. | A new browser tab opens at the affiliate URL. The original tab stays on `/`. |
| 5 | Click on the casino name / card → land on `/casino/<slug>`. | Detail page H1 uses the casino name at `text-4xl font-extrabold` (new `app/casino/[slug]/page.tsx:77`). Below the H1, there is a rating chip styled as a rounded amber-tinted pill **"X.X / 5"** with a star icon. The welcome-offer panel shows uppercase label **"WELCOME OFFER"** with a Gift icon, and the big offer text underneath. Two buttons: **"Claim bonus — Sign up"** (class contains `btn-casino`) and, if a login URL exists, **"Existing user? Login"** (class `btn-ghost-casino`). — Old detail page had no hero panel styling, no "Claim bonus — Sign up" text, and used shadcn button variants. |
| 6 | Navigate to `/admin/login` (anonymous). | Page renders on dark background, gradient dice-icon + brand name at top, heading **"Admin sign in"**. Submit button is the gradient `.btn-casino` — not the old dark-grey shadcn button. Form fields still have labels `Email` and `Password`. |
| 7 | Regression: `curl -s http://localhost:3000/robots.txt` | Response still contains `Disallow: /admin`. (SEO endpoint untouched by the redesign.) |

## Evidence

- Single screen recording of steps 1–6.
- Static screenshots of `/`, `/casino/<slug>`, `/admin/login` for the PR comment.

## Explicit adversarial thinking

- If the `className="dark"` addition to `<html>` was missing, background would be white → step 1 would fail immediately (assertion is on dark body).
- If the `Outfit` font import or CSS layering was broken, the hero H1 would fall back to Geist — harder to detect, so we instead key on **textual content** unique to the new `page.tsx` ("The hottest online casinos", "Hand-picked & verified") and on the presence of the `gradient-text` and `btn-casino` class names, which only exist in the new `globals.css` utility layer.
- If the `.btn-casino` / `.btn-ghost-casino` utilities didn't get emitted (e.g. `@layer utilities` typo), the Sign up button would still be clickable but would render as unstyled text. We check for the class names in the DOM, not just the visual look.
- Because the affiliate attributes are the product's revenue, step 3 specifically checks them on the element itself to rule out any regression introduced while reworking the button structure.

## Code references

- `app/page.tsx:58-169` — new hero, chips, grid.
- `components/ad-card.tsx:21-121` — new article markup, `card-casino`, `btn-casino`, `btn-ghost-casino`, preserved `target`/`rel`.
- `components/site-header.tsx:1-45` — gradient logo, glass nav, chip-divider.
- `app/casino/[slug]/page.tsx:46-164` — new detail-page hero and panels.
- `app/admin/login/page.tsx:22-44` and `app/admin/login/login-form.tsx:58-70` — reskinned login.
- `app/globals.css:51-95` and `:layer utilities` block — new palette + utility classes.
