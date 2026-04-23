import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your ad cards.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
