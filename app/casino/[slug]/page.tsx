import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Gift, Star, Tag } from "lucide-react";
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
    include: { categories: true },
  });
  if (!ad || !ad.published) notFound();

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
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl logo-glow ring-1 ring-white/10">
                <Image
                  src={ad.logoUrl}
                  alt={`${ad.name} logo`}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
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
      </main>
      <SiteFooter />
    </>
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
