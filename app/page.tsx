import type { Metadata } from "next";
import { BadgeCheck, Flame, Sparkles, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { AdCard, type AdCardData } from "@/components/ad-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${siteConfig.name} – Top Welcome Bonuses & Trusted Casinos`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

async function getAds(): Promise<AdCardData[]> {
  try {
    const rows = await prisma.adCard.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      welcomeOffer: r.welcomeOffer,
      logoUrl: r.logoUrl,
      signupUrl: r.signupUrl,
      loginUrl: r.loginUrl,
      rating: r.rating,
      paymentMethods: r.paymentMethods,
      tags: r.tags,
      featured: r.featured,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const ads = await getAds();
  const featuredCount = ads.filter((a) => a.featured).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} – Top Casino Offers`,
    itemListElement: ads.map((ad, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ad.name,
      url: `${siteConfig.url}/casino/${ad.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-orb -left-24 top-4 h-72 w-72 bg-fuchsia-500/40" />
          <div className="hero-orb -right-24 top-24 h-80 w-80 bg-amber-400/30" />
          <div className="hero-orb left-1/2 top-60 h-96 w-96 -translate-x-1/2 bg-purple-600/30" />

          <div className="container relative mx-auto px-4 py-20 md:py-28 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="gradient-text">Hand-picked &amp; verified</span>
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-extrabold tracking-tight md:text-7xl">
              The hottest online casinos,{" "}
              <span className="gradient-text">ranked by real bonuses</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Exclusive welcome offers, instant payouts and trusted licensing —
              all in one place. Pick a brand, claim your bonus and start playing
              in minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-foreground/90">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                {ads.length > 0
                  ? `${ads.length} live offers`
                  : "Fresh offers coming"}
              </span>
              {featuredCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 font-semibold text-amber-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {featuredCount} featured
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-foreground/90">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
                Updated daily
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-foreground/90">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                Licensed operators only
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#top-offers"
                className="btn-casino inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide"
              >
                Browse top offers
              </a>
              <a
                href="#responsible-gaming"
                className="btn-ghost-casino inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold"
              >
                Play responsibly
              </a>
            </div>
          </div>
        </section>

        {/* Offers grid */}
        <section id="top-offers" className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">
                Top offers
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">
                This week&apos;s hottest casino bonuses
              </h2>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              {ads.length > 0
                ? `${ads.length} active offer${ads.length === 1 ? "" : "s"}`
                : null}
            </p>
          </div>

          {ads.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-14 text-center">
              <div className="hero-orb left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/20" />
              <p className="relative text-lg font-semibold text-foreground">
                No offers published yet
              </p>
              <p className="relative mt-2 text-sm text-muted-foreground">
                Sign in to the admin dashboard and add your first casino card.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
