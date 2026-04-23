import Link from "next/link";
import { Dices } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl casino-gradient shadow-[0_8px_24px_-8px_rgba(236,72,153,0.6)]">
            <Dices className="h-5 w-5 text-white" strokeWidth={2.4} />
            <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">{siteConfig.name}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-white/5 transition"
          >
            Casinos
          </Link>
          <Link
            href="/#top-offers"
            className="hidden sm:inline rounded-full px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-white/5 transition"
          >
            Top Offers
          </Link>
          <Link
            href="/#responsible-gaming"
            className="hidden sm:inline rounded-full px-3 py-1.5 text-foreground/80 hover:text-foreground hover:bg-white/5 transition"
          >
            18+ Responsible
          </Link>
        </nav>
      </div>
      <div className="chip-divider" />
    </header>
  );
}
