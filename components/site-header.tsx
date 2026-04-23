import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center font-semibold tracking-tight"
          aria-label="Home"
        >
          <BrandMark size={36} nameClassName="text-lg" />
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
