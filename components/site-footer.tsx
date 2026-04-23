import { Dices, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer
      id="responsible-gaming"
      className="relative mt-20 border-t border-white/5 bg-background/60"
    >
      <div className="chip-divider absolute left-0 right-0 top-0" />
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg casino-gradient">
              <Dices className="h-4 w-4 text-white" strokeWidth={2.4} />
            </span>
            <span className="gradient-text text-base font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </div>
          <p>
            Hand-picked online casinos and sportsbooks with the best welcome
            bonuses, fast payouts and trusted licensing.
          </p>
        </div>
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Responsible Gaming 18+
          </p>
          <p>
            Gambling can be addictive. Please play responsibly. The offers listed
            on this site are from third-party operators and are subject to the
            operators&apos; terms and conditions. Bonuses are only available to
            players in jurisdictions where online gambling is legal.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-semibold text-foreground">Legal</p>
          <p>
            Always check local laws before participating. We may earn a
            commission when you sign up through the links on this site, at no
            cost to you.
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. All trademarks
            belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
