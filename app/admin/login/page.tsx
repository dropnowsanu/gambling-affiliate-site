import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">,
) {
  const session = await auth();
  const sp = await props.searchParams;
  const callbackUrl =
    typeof sp.callbackUrl === "string" ? sp.callbackUrl : "/admin";
  if (session?.user) redirect(callbackUrl);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="hero-orb -left-20 top-10 h-72 w-72 bg-fuchsia-500/35" />
      <div className="hero-orb -right-20 bottom-10 h-80 w-80 bg-amber-400/25" />
      <div className="card-casino relative w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6">
          <BrandMark size={40} nameClassName="text-xl font-extrabold" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your casino ad cards.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
