import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  let ads: { slug: string; updatedAt: Date }[] = [];
  try {
    ads = await prisma.adCard.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB unavailable during build — fall back to static routes only.
  }

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...ads.map((ad) => ({
      url: `${base}/casino/${ad.slug}`,
      lastModified: ad.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
