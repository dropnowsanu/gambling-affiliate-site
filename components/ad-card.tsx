import Image from "next/image";
import { Crown, Gift, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AdCardData = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  welcomeOffer: string;
  logoUrl: string;
  signupUrl: string;
  loginUrl?: string | null;
  rating?: number | null;
  paymentMethods: string[];
  tags: string[];
  featured?: boolean;
};

export function AdCard({ ad }: { ad: AdCardData }) {
  return (
    <article
      className={cn(
        "card-casino group relative flex flex-col overflow-hidden rounded-2xl p-5",
        ad.featured && "card-casino-featured",
      )}
    >
      {ad.featured ? (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-lg shadow-amber-500/30">
          <Crown className="h-3 w-3" />
          Featured
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl logo-glow ring-1 ring-white/10">
          <Image
            src={ad.logoUrl}
            alt={`${ad.name} logo`}
            fill
            sizes="64px"
            className="object-contain p-1.5"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
            {ad.name}
          </h3>
          {typeof ad.rating === "number" && ad.rating > 0 ? (
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">
                {ad.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 casino-gradient-soft">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200/90">
          <Gift className="h-3.5 w-3.5" />
          Welcome offer
        </p>
        <p className="mt-1 text-lg font-extrabold leading-snug text-foreground">
          {ad.welcomeOffer}
        </p>
      </div>

      <div className="mt-4 flex-1 space-y-3 text-sm text-muted-foreground">
        {ad.description ? (
          <p className="line-clamp-3">{ad.description}</p>
        ) : null}

        {ad.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {ad.tags.slice(0, 4).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-full border border-white/10 bg-white/5 font-medium text-foreground/85"
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {ad.paymentMethods.length > 0 ? (
          <div className="text-xs">
            <span className="font-semibold text-foreground/80">Payments: </span>
            <span>{ad.paymentMethods.slice(0, 5).join(", ")}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex gap-2.5">
        <a
          href={ad.signupUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="btn-casino inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-bold tracking-wide"
        >
          Sign up
        </a>
        {ad.loginUrl ? (
          <a
            href={ad.loginUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="btn-ghost-casino inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-semibold"
          >
            Login
          </a>
        ) : null}
      </div>
    </article>
  );
}
