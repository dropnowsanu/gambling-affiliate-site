# Test report — casino-themed UI redesign (PR #3)

**Target:** `http://localhost:3000` (PR branch `devin/1776957934-ui-casino-theme`, `next build && next start` against the same Neon DB as prod).
**Why localhost:** the Vercel preview for this branch is SSO-protected (HTTP 401) and I don't have a protection-bypass token. Running the built artefact locally is a faithful stand-in — the code path, component tree and CSS bundle are identical to what Vercel would serve.
**PR:** https://github.com/dropnowsanu/gambling-affiliate-site/pull/3 — CI 2/2 green.

Recording: https://app.devin.ai/attachments/92883575-5e87-49e3-87c4-7e3b1a62c3a7/rec-3deec6bc-dc85-4b79-bbf9-af78e3d07d07-subtitled.mp4

## Results

| # | Test | Result |
|---|---|---|
| 1 | It should render the new dark casino hero on `/` | passed |
| 2 | It should render new `card-casino` + `btn-casino` with correct affiliate `rel`/`target` | passed |
| 3 | It should render the new detail page hero on `/casino/mostplay` | passed |
| 4 | It should reskin `/admin/login` to match the new theme | passed |
| 5 | Regression: `/robots.txt` still disallows `/admin` and sitemap omits admin routes | passed |

## Evidence

### 1 — Home hero (new dark theme, gradient H1)
![home-hero](https://app.devin.ai/attachments/09109867-f920-4347-9f9b-924fd8aaef38/home-hero.png)

DOM evidence from `page.evaluate` (full JSON in the Devin session):
- `htmlDark: true` (class `dark` on `<html>`)
- `bodyBg: lab(2.31 2.02 -6.5)` — near-black indigo (old UI was white)
- `h1Text: "The hottest online casinos, ranked by real bonuses"`
- `h1FontFamily: "Outfit, Outfit Fallback"` — new `next/font/google` import applied
- `gradientSpanText: ["ranked by real bonuses"]` — span has `.gradient-text` class

### 2 — New ad card with glow-y CTAs (affiliate attributes preserved)
![home-grid](https://app.devin.ai/attachments/81fed10f-3edb-4e68-a416-68255bfd1ee6/home-grid.png)

Both casino cards are now `<article class="card-casino …>` with a "WELCOME OFFER" ticket. Signup DOM:
```
a.btn-casino  text="Sign up"  href=https://mostplayipl.club/af/2M41491l/join
              target=_blank   rel="nofollow sponsored noopener noreferrer"
a.btn-casino  text="Sign up"  href=https://bjpartner.vip/af/4Lonz98P/join
              target=_blank   rel="nofollow sponsored noopener noreferrer"
```
Login buttons (`a.btn-ghost-casino`) have the same `target`/`rel`. No regression on monetisation attributes.

### 3 — Detail page hero (`/casino/mostplay`)
![detail-mostplay](https://app.devin.ai/attachments/4e1d8fd9-cfa2-46ce-a068-34a3ef970ec8/detail-mostplay.png)

- H1 "MostPlay" with class `text-4xl font-extrabold tracking-tight md:text-5xl`
- Gold rating pill (`4.9 / 5`)
- Welcome-offer panel renders inside a `.card-casino` shell
- Primary CTA text: `Claim bonus — Sign up` (new copy, class `btn-casino`)
- Secondary CTA text: `Existing user? Login` (class `btn-ghost-casino`)
- Both CTAs: `target=_blank`, `rel="nofollow sponsored noopener noreferrer"`

### 4 — Reskinned admin login
![admin-login](https://app.devin.ai/attachments/087f5a7c-7566-47a6-94c8-08e62025d80e/admin-login.png)

- Dark background with hero-orb bleed in corners
- Gradient dice-icon logo + brand name
- H1 "Admin sign in" above form
- Submit button class: `btn-casino inline-flex h-11 w-full …` — no longer the old shadcn default button
- Inputs (Email, Password) and form behaviour unchanged

### 5 — SEO regression
```
$ curl -s http://localhost:3000/robots.txt
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api
Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```
`sitemap.xml` lists `/`, `/casino/mostplay`, `/casino/betjili` — no admin routes leak.

## Caveats

- Visual verification was done against a local `next start` on the PR branch because the Vercel preview URL is protected by SSO. The **same bundle** will ship to prod after merge; if you want me to re-verify on the live `https://gambling-affiliate-site.vercel.app` after merge (which is not SSO-protected on production), say the word.
- I did not wire an end-to-end click that opens the affiliate URL in a new tab through Playwright's popup API — the popup event didn't fire in CDP within the timeout. I proved the same property a different way: the anchor in the DOM has `target="_blank"` + the correct `rel` + the real affiliate `href`, which is what actually causes the new tab to open. Browsers will honour that.

## Next steps

- Merge PR #3 when ready.
- Re-verify on prod post-merge (optional).
