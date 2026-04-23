import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer
      id="responsible-gaming"
      className="border-t border-border/60 bg-muted/30 mt-16"
    >
      <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground space-y-4">
        <p className="font-medium text-foreground">Responsible Gaming 18+</p>
        <p>
          Gambling can be addictive. Please play responsibly. The offers listed on
          this site are from third-party operators and are subject to the
          operators&apos; terms and conditions. Bonuses are only available to
          players in jurisdictions where online gambling is legal. Always check
          local laws before participating.
        </p>
        <p className="text-xs">
          © {new Date().getFullYear()} {siteConfig.name}. All trademarks belong
          to their respective owners.
        </p>
      </div>
    </footer>
  );
}
