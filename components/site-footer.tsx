import Link from "next/link";
import type { SVGProps } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "@/components/brand-mark";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/social-icons";

type SocialLink = {
  name: string;
  href: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { name: "X", href: "https://x.com", icon: XIcon },
  { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { name: "Telegram", href: "https://t.me", icon: TelegramIcon },
  { name: "YouTube", href: "https://youtube.com", icon: YouTubeIcon },
];

type FooterLink = { label: string; href: string };

const quickLinks: FooterLink[] = [
  { label: "Top offers", href: "/#top-offers" },
  { label: "How we rank", href: "/#how-we-rank" },
  { label: "Responsible gaming", href: "/#responsible-gaming" },
  { label: "Admin", href: "/admin" },
];

const categoryLinks: FooterLink[] = [
  { label: "Casinos", href: "/#top-offers" },
  { label: "Sportsbook", href: "/#top-offers" },
  { label: "Live dealer", href: "/#top-offers" },
  { label: "Crash & Aviator", href: "/#top-offers" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="responsible-gaming"
      className="relative mt-20 border-t border-white/5 bg-background/60"
    >
      <div className="chip-divider absolute left-0 right-0 top-0" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + about + socials */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex font-semibold text-foreground"
              aria-label="Home"
            >
              <BrandMark size={40} nameClassName="text-lg" />
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Hand-picked online casinos and sportsbooks with the best welcome
              bonuses, fast payouts and trusted licensing. Compare operators
              side by side and claim exclusive offers in one click.
            </p>
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Responsible Gaming 18+
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-foreground/80 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/80">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 transition hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Categories" className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/80">
              Categories
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categoryLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 transition hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/80">
              <Mail className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              Newsletter
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Legal band */}
        <div className="mt-10 grid gap-4 border-t border-white/5 pt-6 text-xs text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-3xl">
            Gambling can be addictive. Please play responsibly. The offers
            listed on this site are from third-party operators and are subject
            to the operators&apos; terms and conditions. Bonuses are only
            available to players in jurisdictions where online gambling is
            legal. Always check local laws before participating. We may earn a
            commission when you sign up through the links on this site, at no
            cost to you.
          </p>
          <p className="md:text-right">
            © {year} {siteConfig.name}. All trademarks belong to their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
