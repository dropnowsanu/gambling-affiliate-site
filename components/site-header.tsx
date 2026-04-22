import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600" />
          <span className="text-lg">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Casinos
          </Link>
          <a
            href="#top-offers"
            className="hover:text-foreground hidden sm:inline"
          >
            Top Offers
          </a>
          <a
            href="#responsible-gaming"
            className="hover:text-foreground hidden sm:inline"
          >
            Responsible Gaming
          </a>
        </nav>
      </div>
    </header>
  );
}
