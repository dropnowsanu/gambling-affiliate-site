"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { ActionResult } from "../actions";

export type AdFormInitial = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  welcomeOffer: string;
  logoUrl: string;
  logoPublicId: string;
  signupUrl: string;
  loginUrl: string;
  rating: number;
  paymentMethods: string[];
  tags: string[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
};

export const emptyInitial: AdFormInitial = {
  name: "",
  slug: "",
  description: "",
  welcomeOffer: "",
  logoUrl: "",
  logoPublicId: "",
  signupUrl: "",
  loginUrl: "",
  rating: 0,
  paymentMethods: [],
  tags: [],
  displayOrder: 0,
  featured: false,
  published: true,
};

export function AdForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  initial: AdFormInitial;
  submitLabel: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (prev, fd) => {
    const res = await action(prev, fd);
    if (res.ok) {
      toast.success("Saved");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    return res;
  }, null);

  const [logo, setLogo] = useState({
    url: initial.logoUrl,
    publicId: initial.logoPublicId,
  });
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const err = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <input type="hidden" name="logoUrl" value={logo.url} />
      <input type="hidden" name="logoPublicId" value={logo.publicId} />

      <section className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted ring-1 ring-border flex items-center justify-center text-xs text-muted-foreground">
            {logo.url ? (
              <Image
                src={logo.url}
                alt="logo preview"
                fill
                sizes="80px"
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              "No logo"
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                startUpload(async () => {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                  });
                  if (!res.ok) {
                    toast.error("Upload failed");
                    return;
                  }
                  const data = (await res.json()) as {
                    url: string;
                    publicId: string;
                  };
                  setLogo({ url: data.url, publicId: data.publicId });
                  toast.success("Logo uploaded");
                });
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? "Uploading…"
                : logo.url
                  ? "Replace logo"
                  : "Upload logo"}
            </Button>
            {err?.logoUrl ? (
              <p className="mt-1 text-xs text-destructive">{err.logoUrl[0]}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Casino name" htmlFor="name" error={err?.name?.[0]}>
          <Input id="name" name="name" defaultValue={initial.name} required />
        </Field>
        <Field
          label="Slug (optional)"
          htmlFor="slug"
          hint="Auto-generated from name if empty"
          error={err?.slug?.[0]}
        >
          <Input id="slug" name="slug" defaultValue={initial.slug} />
        </Field>
      </div>

      <Field
        label="Welcome offer"
        htmlFor="welcomeOffer"
        error={err?.welcomeOffer?.[0]}
        hint="e.g. 100% up to $500 + 200 Free Spins"
      >
        <Input
          id="welcomeOffer"
          name="welcomeOffer"
          defaultValue={initial.welcomeOffer}
          required
        />
      </Field>

      <Field
        label="Short description"
        htmlFor="description"
        error={err?.description?.[0]}
      >
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial.description}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Signup URL" htmlFor="signupUrl" error={err?.signupUrl?.[0]}>
          <Input
            id="signupUrl"
            name="signupUrl"
            type="url"
            defaultValue={initial.signupUrl}
            placeholder="https://example.com/?ref=yourid"
            required
          />
        </Field>
        <Field
          label="Login URL (optional)"
          htmlFor="loginUrl"
          error={err?.loginUrl?.[0]}
        >
          <Input
            id="loginUrl"
            name="loginUrl"
            type="url"
            defaultValue={initial.loginUrl}
            placeholder="https://example.com/login"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Rating (0–5)" htmlFor="rating" error={err?.rating?.[0]}>
          <Input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={String(initial.rating)}
          />
        </Field>
        <Field
          label="Display order"
          htmlFor="displayOrder"
          hint="Lower shows first"
          error={err?.displayOrder?.[0]}
        >
          <Input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue={String(initial.displayOrder)}
          />
        </Field>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="featured"
              defaultChecked={initial.featured}
              value="on"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="published"
              defaultChecked={initial.published}
              value="on"
            />
            Published
          </label>
        </div>
      </div>

      <Field
        label="Tags / categories (comma-separated)"
        htmlFor="tags"
        hint="e.g. slots, live casino, sportsbook"
      >
        <Input id="tags" name="tags" defaultValue={initial.tags.join(", ")} />
      </Field>

      <Field
        label="Payment methods (comma-separated)"
        htmlFor="paymentMethods"
        hint="e.g. Visa, Mastercard, Bitcoin, PayPal"
      >
        <Input
          id="paymentMethods"
          name="paymentMethods"
          defaultValue={initial.paymentMethods.join(", ")}
        />
      </Field>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
        {state && !state.ok ? (
          <span className="text-sm text-destructive">{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
