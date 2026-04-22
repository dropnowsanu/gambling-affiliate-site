import type { Metadata } from "next";
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
        <section className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
          <div className="container mx-auto px-4 py-14 md:py-20 text-center">
            <h1 className="mx-auto max-w-3xl text-balance text-4xl md:text-5xl font-bold tracking-tight">
              The best online casinos, ranked by real welcome bonuses
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground md:text-lg">
              {siteConfig.description}
            </p>
          </div>
        </section>

        <section id="top-offers" className="container mx-auto px-4 py-10">
          {ads.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                No offers published yet
              </p>
              <p className="mt-2 text-sm">
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
