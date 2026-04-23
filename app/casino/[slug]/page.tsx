import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            ← Back to all offers
          </Link>
        </nav>

        <div className="flex items-start gap-5">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
            <Image
              src={ad.logoUrl}
              alt={`${ad.name} logo`}
              fill
              sizes="80px"
              className="object-contain p-1"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">{ad.name}</h1>
            {ad.rating && ad.rating > 0 ? (
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {ad.rating.toFixed(1)}
                </span>
                <span>/ 5</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Welcome Offer
          </p>
          <p className="mt-1 text-xl font-semibold">{ad.welcomeOffer}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={ad.signupUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                className: "flex-1",
              })}
            >
              Claim bonus – Sign up
            </a>
            {ad.loginUrl ? (
              <a
                href={ad.loginUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "flex-1",
                })}
              >
                Existing user? Login
              </a>
            ) : null}
          </div>
        </div>

        {ad.description ? (
          <section className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
            <h2 className="text-xl font-semibold">About {ad.name}</h2>
            <p className="text-muted-foreground">{ad.description}</p>
          </section>
        ) : null}

        <Separator className="my-8" />

        <div className="grid gap-6 sm:grid-cols-2">
          {ad.tags.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ad.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {ad.paymentMethods.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium">Payment methods</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {ad.paymentMethods.join(", ")}
              </p>
            </div>
          ) : null}
        </div>
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
