"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong.",
        });
        return;
      }
      setStatus({ kind: "success" });
      setEmail("");
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-3 text-sm text-emerald-200">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        <span>You&apos;re on the list — check your inbox for the latest offers.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label
        htmlFor="newsletter-email"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70"
      >
        Get the best bonuses by email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status.kind === "loading"}
            aria-invalid={status.kind === "error"}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:border-white/25 focus:bg-white/[0.07] disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="btn-casino inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold tracking-wide disabled:opacity-60"
        >
          {status.kind === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing…
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {status.kind === "error" ? (
        <p
          role="alert"
          className="text-xs font-medium text-destructive-foreground/90 text-rose-300"
        >
          {status.message}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          No spam. Unsubscribe any time.
        </p>
      )}
    </form>
  );
}
