import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-muted/20">
      {isLoggedIn ? (
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-semibold">
                Admin
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/admin" className="hover:text-foreground">
                  Ad cards
                </Link>
                <Link href="/admin/ads/new" className="hover:text-foreground">
                  New ad
                </Link>
                <Link href="/" className="hover:text-foreground">
                  View site ↗
                </Link>
              </nav>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out · {session?.user?.email}
              </Button>
            </form>
          </div>
        </header>
      ) : null}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
