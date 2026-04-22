export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Top Casino Offers",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Hand-picked online casinos and sportsbooks with the best welcome bonuses, fast payouts and trusted licensing.",
  keywords: [
    "online casino",
    "casino bonuses",
    "welcome offer",
    "sportsbook",
    "gambling sites",
    "affiliate",
  ],
} as const;
