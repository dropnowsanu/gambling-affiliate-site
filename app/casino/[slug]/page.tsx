import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Dice5, Gift, Star, Tag, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata(
  props: PageProps<"/casino/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ad = await prisma.adCard.findUnique({ where: { slug } });
  if (!ad) return { title: "Casino not found" };
  const title = `${ad.name} Review & Welcome Bonus`;
  const description =
    ad.description ?? `${ad.name} welcome offer: ${ad.welcomeOffer}.`;
  return {
    title,
    description,
    alternates: { canonical: `/casino/${ad.slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ad.logoUrl],
      url: `${siteConfig.url}/casino/${ad.slug}`,
    },
  };
}

export default async function CasinoPage(props: PageProps<"/casino/[slug]">) {
  const { slug } = await props.params;
  const ad = await prisma.adCard.findUnique({
    where: { slug },
    include: {
      categories: true,
      providers: { orderBy: [{ displayOrder: "asc" }, { name: "asc" }] },
    },
  });
  if (!ad || !ad.published) notFound();

  const sportsProviders = ad.providers.filter((p) => p.kind === "SPORTS");
  const casinoProviders = ad.providers.filter((p) => p.kind === "CASINO");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-orb -left-20 top-0 h-64 w-64 bg-fuchsia-500/30" />
          <div className="hero-orb -right-20 top-24 h-72 w-72 bg-amber-400/25" />

          <div className="container relative mx-auto max-w-4xl px-4 pt-10 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all offers
            </Link>
          </div>

          <div className="container relative mx-auto max-w-4xl px-4 pb-8">
            <div className="flex items-start gap-5">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full logo-glow ring-1 ring-white/15">
                <Image
                  src={ad.logoUrl}
                  alt={`${ad.name} logo`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                  {ad.name}
                </h1>
                {ad.rating && ad.rating > 0 ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-amber-200">
                      {ad.rating.toFixed(1)}
                    </span>
                    <span className="text-amber-200/70">/ 5</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 pb-4">
          <div className="card-casino relative overflow-hidden rounded-2xl p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
              <Gift className="h-4 w-4" />
              Welcome offer
            </p>
            <p className="mt-2 text-2xl font-extrabold leading-snug md:text-3xl">
              {ad.welcomeOffer}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={ad.signupUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="btn-casino inline-flex h-12 flex-1 min-w-[200px] items-center justify-center rounded-xl px-6 text-sm font-bold tracking-wide"
              >
                Claim bonus — Sign up
              </a>
              {ad.loginUrl ? (
                <a
                  href={ad.loginUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="btn-ghost-casino inline-flex h-12 flex-1 min-w-[200px] items-center justify-center rounded-xl px-6 text-sm font-semibold"
                >
                  Existing user? Login
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {ad.description ? (
          <section className="container mx-auto max-w-4xl px-4 mt-8">
            <h2 className="text-xl font-bold tracking-tight">
              About {ad.name}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {ad.description}
            </p>
          </section>
        ) : null}

        <section className="container mx-auto max-w-4xl px-4 mt-8 grid gap-4 sm:grid-cols-2">
          {ad.tags.length > 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-fuchsia-300">
                <Tag className="h-4 w-4" />
                Categories
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ad.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="rounded-full border border-white/10 bg-white/5 font-medium text-foreground/85"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {ad.paymentMethods.length > 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-300">
                <CreditCard className="h-4 w-4" />
                Payment methods
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {ad.paymentMethods.join(", ")}
              </p>
            </div>
          ) : null}
        </section>

        {ad.providers.length > 0 ? (
          <section className="container mx-auto max-w-4xl px-4 mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                Game &amp; sports providers
              </h2>
              <span className="text-xs text-muted-foreground">
                {ad.providers.length} total
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ProviderColumn
                title="Sports providers"
                icon={<Trophy className="h-4 w-4" />}
                accent="from-fuchsia-500/40 via-pink-500/20 to-transparent"
                tone="text-fuchsia-200"
                providers={sportsProviders}
                emptyLabel="No sports providers listed yet."
              />
              <ProviderColumn
                title="Casino providers"
                icon={<Dice5 className="h-4 w-4" />}
                accent="from-amber-400/40 via-orange-500/20 to-transparent"
                tone="text-amber-200"
                providers={casinoProviders}
                emptyLabel="No casino providers listed yet."
              />
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

type ProviderRow = {
  id: string;
  name: string;
  logoUrl: string | null;
};

function ProviderColumn({
  title,
  icon,
  accent,
  tone,
  providers,
  emptyLabel,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  tone: string;
  providers: ProviderRow[];
  emptyLabel: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.015] p-[1px] shadow-[0_30px_80px_-40px_rgba(236,72,153,0.35)] transition hover:border-white/20">
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 h-40 w-[140%] -translate-x-1/2 bg-gradient-radial ${accent} opacity-60 blur-2xl`}
        aria-hidden
      />
      <div className="relative rounded-2xl bg-background/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] ${tone}`}>
            {icon}
            {title}
          </h3>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold text-foreground/70">
            {providers.length}
          </span>
        </div>

        {providers.length === 0 ? (
          <p className="mt-4 text-xs text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5">
            {providers.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 py-2.5 transition hover:bg-white/[0.02]"
              >
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.05]">
                  {p.logoUrl ? (
                    <Image
                      src={p.logoUrl}
                      alt={`${p.name} logo`}
                      fill
                      sizes="36px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-foreground/60">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90">
                  {p.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const rows = await prisma.adCard.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}
