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

export type ProviderKindValue = "SPORTS" | "CASINO";
export type HighlightKindValue = "PRO" | "CON";

export type ProviderDraft = {
  key: string;
  kind: ProviderKindValue;
  name: string;
  logoUrl: string;
  displayOrder: number;
};

export type HighlightDraft = {
  key: string;
  kind: HighlightKindValue;
  text: string;
  displayOrder: number;
};

export type FactDraft = {
  key: string;
  label: string;
  value: string;
  icon: string;
  displayOrder: number;
};

export type FaqDraft = {
  key: string;
  question: string;
  answer: string;
  displayOrder: number;
};

export type SectionDraft = {
  key: string;
  heading: string;
  body: string;
  displayOrder: number;
};

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
  registrationUrl: string;
  rating: number;
  paymentMethods: string[];
  tags: string[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
  authorName: string;
  authorUrl: string;
  authorAvatarUrl: string;
  providers: { kind: ProviderKindValue; name: string; logoUrl: string; displayOrder: number }[];
  highlights: { kind: HighlightKindValue; text: string; displayOrder: number }[];
  facts: { label: string; value: string; icon: string; displayOrder: number }[];
  faqs: { question: string; answer: string; displayOrder: number }[];
  sections: { heading: string; body: string; displayOrder: number }[];
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
  registrationUrl: "",
  rating: 0,
  paymentMethods: [],
  tags: [],
  displayOrder: 0,
  featured: false,
  published: true,
  authorName: "",
  authorUrl: "",
  authorAvatarUrl: "",
  providers: [],
  highlights: [],
  facts: [],
  faqs: [],
  sections: [],
};

function newKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

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

  const [providers, setProviders] = useState<ProviderDraft[]>(() =>
    initial.providers.map((p, i) => ({
      key: `p-init-${i}`,
      kind: p.kind,
      name: p.name,
      logoUrl: p.logoUrl,
      displayOrder: p.displayOrder,
    })),
  );

  const [highlights, setHighlights] = useState<HighlightDraft[]>(() =>
    initial.highlights.map((h, i) => ({
      key: `h-init-${i}`,
      kind: h.kind,
      text: h.text,
      displayOrder: h.displayOrder,
    })),
  );

  const [facts, setFacts] = useState<FactDraft[]>(() =>
    initial.facts.map((f, i) => ({
      key: `f-init-${i}`,
      label: f.label,
      value: f.value,
      icon: f.icon,
      displayOrder: f.displayOrder,
    })),
  );

  const [faqs, setFaqs] = useState<FaqDraft[]>(() =>
    initial.faqs.map((f, i) => ({
      key: `q-init-${i}`,
      question: f.question,
      answer: f.answer,
      displayOrder: f.displayOrder,
    })),
  );

  const [sections, setSections] = useState<SectionDraft[]>(() =>
    initial.sections.map((s, i) => ({
      key: `s-init-${i}`,
      heading: s.heading,
      body: s.body,
      displayOrder: s.displayOrder,
    })),
  );

  const addProvider = (kind: ProviderKindValue) =>
    setProviders((curr) => [
      ...curr,
      {
        key: newKey("p"),
        kind,
        name: "",
        logoUrl: "",
        displayOrder: curr.filter((p) => p.kind === kind).length,
      },
    ]);
  const updateProvider = (key: string, patch: Partial<ProviderDraft>) =>
    setProviders((curr) => curr.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  const removeProvider = (key: string) =>
    setProviders((curr) => curr.filter((p) => p.key !== key));

  const addHighlight = (kind: HighlightKindValue) =>
    setHighlights((curr) => [
      ...curr,
      {
        key: newKey("h"),
        kind,
        text: "",
        displayOrder: curr.filter((h) => h.kind === kind).length,
      },
    ]);
  const updateHighlight = (key: string, patch: Partial<HighlightDraft>) =>
    setHighlights((curr) => curr.map((h) => (h.key === key ? { ...h, ...patch } : h)));
  const removeHighlight = (key: string) =>
    setHighlights((curr) => curr.filter((h) => h.key !== key));

  const addFact = () =>
    setFacts((curr) => [
      ...curr,
      { key: newKey("f"), label: "", value: "", icon: "", displayOrder: curr.length },
    ]);
  const updateFact = (key: string, patch: Partial<FactDraft>) =>
    setFacts((curr) => curr.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  const removeFact = (key: string) =>
    setFacts((curr) => curr.filter((f) => f.key !== key));

  const addFaq = () =>
    setFaqs((curr) => [
      ...curr,
      { key: newKey("q"), question: "", answer: "", displayOrder: curr.length },
    ]);
  const updateFaq = (key: string, patch: Partial<FaqDraft>) =>
    setFaqs((curr) => curr.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  const removeFaq = (key: string) =>
    setFaqs((curr) => curr.filter((q) => q.key !== key));

  const addSection = () =>
    setSections((curr) => [
      ...curr,
      { key: newKey("s"), heading: "", body: "", displayOrder: curr.length },
    ]);
  const updateSection = (key: string, patch: Partial<SectionDraft>) =>
    setSections((curr) => curr.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  const removeSection = (key: string) =>
    setSections((curr) => curr.filter((s) => s.key !== key));

  const providersJson = JSON.stringify(
    providers
      .filter((p) => p.name.trim())
      .map((p) => ({
        kind: p.kind,
        name: p.name.trim(),
        logoUrl: p.logoUrl.trim() || undefined,
        displayOrder: p.displayOrder,
      })),
  );
  const highlightsJson = JSON.stringify(
    highlights
      .filter((h) => h.text.trim())
      .map((h) => ({ kind: h.kind, text: h.text.trim(), displayOrder: h.displayOrder })),
  );
  const factsJson = JSON.stringify(
    facts
      .filter((f) => f.label.trim() && f.value.trim())
      .map((f) => ({
        label: f.label.trim(),
        value: f.value.trim(),
        icon: f.icon.trim() || undefined,
        displayOrder: f.displayOrder,
      })),
  );
  const faqsJson = JSON.stringify(
    faqs
      .filter((q) => q.question.trim() && q.answer.trim())
      .map((q) => ({
        question: q.question.trim(),
        answer: q.answer.trim(),
        displayOrder: q.displayOrder,
      })),
  );
  const sectionsJson = JSON.stringify(
    sections
      .filter((s) => s.heading.trim() && s.body.trim())
      .map((s) => ({
        heading: s.heading.trim(),
        body: s.body.trim(),
        displayOrder: s.displayOrder,
      })),
  );

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
        <Field
          label="Registration URL (optional)"
          htmlFor="registrationUrl"
          hint="If empty, falls back to the Signup URL"
          error={err?.registrationUrl?.[0]}
        >
          <Input
            id="registrationUrl"
            name="registrationUrl"
            type="url"
            defaultValue={initial.registrationUrl}
            placeholder="https://example.com/registration"
          />
        </Field>
      </div>

      <section className="space-y-3 rounded-xl border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold">Review author</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Author name" htmlFor="authorName" error={err?.authorName?.[0]}>
            <Input
              id="authorName"
              name="authorName"
              defaultValue={initial.authorName}
              placeholder="Kenley Ward"
            />
          </Field>
          <Field
            label="Author profile URL"
            htmlFor="authorUrl"
            error={err?.authorUrl?.[0]}
          >
            <Input
              id="authorUrl"
              name="authorUrl"
              type="url"
              defaultValue={initial.authorUrl}
              placeholder="https://yoursite.com/authors/kenley"
            />
          </Field>
          <Field
            label="Author avatar URL"
            htmlFor="authorAvatarUrl"
            error={err?.authorAvatarUrl?.[0]}
          >
            <Input
              id="authorAvatarUrl"
              name="authorAvatarUrl"
              type="url"
              defaultValue={initial.authorAvatarUrl}
              placeholder="https://.../avatar.png"
            />
          </Field>
        </div>
      </section>

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

      <input type="hidden" name="providers" value={providersJson} />
      <input type="hidden" name="highlights" value={highlightsJson} />
      <input type="hidden" name="facts" value={factsJson} />
      <input type="hidden" name="faqs" value={faqsJson} />
      <input type="hidden" name="sections" value={sectionsJson} />

      <section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div>
          <h3 className="text-sm font-semibold">Sports & Casino providers</h3>
          <p className="text-xs text-muted-foreground">
            Rendered as two columns on the casino detail page.
          </p>
        </div>

        <ProviderList
          title="Sports providers"
          kind="SPORTS"
          items={providers.filter((p) => p.kind === "SPORTS")}
          onAdd={() => addProvider("SPORTS")}
          onUpdate={updateProvider}
          onRemove={removeProvider}
        />
        <ProviderList
          title="Casino providers"
          kind="CASINO"
          items={providers.filter((p) => p.kind === "CASINO")}
          onAdd={() => addProvider("CASINO")}
          onUpdate={updateProvider}
          onRemove={removeProvider}
        />
      </section>

      <section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div>
          <h3 className="text-sm font-semibold">Pros &amp; cons</h3>
          <p className="text-xs text-muted-foreground">
            Two bullet columns on the detail page (green pros / red cons).
          </p>
        </div>
        <HighlightList
          title="Pros"
          kind="PRO"
          items={highlights.filter((h) => h.kind === "PRO")}
          onAdd={() => addHighlight("PRO")}
          onUpdate={updateHighlight}
          onRemove={removeHighlight}
        />
        <HighlightList
          title="Cons"
          kind="CON"
          items={highlights.filter((h) => h.kind === "CON")}
          onAdd={() => addHighlight("CON")}
          onUpdate={updateHighlight}
          onRemove={removeHighlight}
        />
      </section>

      <section className="space-y-3 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Quick facts</h3>
            <p className="text-xs text-muted-foreground">
              Label + value pairs (e.g. &ldquo;Withdrawal&rdquo; / &ldquo;Instant&rdquo;).
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addFact}>
            + Add fact
          </Button>
        </div>
        {facts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No quick facts yet.</p>
        ) : (
          <ul className="space-y-2">
            {facts.map((f) => (
              <li
                key={f.key}
                className="grid grid-cols-1 gap-2 rounded-md border bg-background p-2 sm:grid-cols-[1fr_1.5fr_auto]"
              >
                <Input
                  placeholder="Label (e.g. Withdrawal)"
                  value={f.label}
                  onChange={(e) => updateFact(f.key, { label: e.target.value })}
                />
                <Input
                  placeholder="Value (e.g. Instant)"
                  value={f.value}
                  onChange={(e) => updateFact(f.key, { value: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFact(f.key)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Review sections</h3>
            <p className="text-xs text-muted-foreground">
              Long-form H2 sections. Each gets an anchor ID and appears in the
              TOC.
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addSection}>
            + Add section
          </Button>
        </div>
        {sections.length === 0 ? (
          <p className="text-xs text-muted-foreground">No sections yet.</p>
        ) : (
          <ul className="space-y-3">
            {sections.map((s, i) => (
              <li key={s.key} className="space-y-2 rounded-md border bg-background p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <Input
                    placeholder="Heading (e.g. Melbet App for Android)"
                    value={s.heading}
                    onChange={(e) => updateSection(s.key, { heading: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(s.key)}
                  >
                    Remove
                  </Button>
                </div>
                <Textarea
                  rows={4}
                  placeholder="Body copy. Blank lines start a new paragraph."
                  value={s.body}
                  onChange={(e) => updateSection(s.key, { body: e.target.value })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">FAQ</h3>
            <p className="text-xs text-muted-foreground">
              Rendered as an accordion at the bottom of the detail page.
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addFaq}>
            + Add question
          </Button>
        </div>
        {faqs.length === 0 ? (
          <p className="text-xs text-muted-foreground">No questions yet.</p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((q) => (
              <li key={q.key} className="space-y-2 rounded-md border bg-background p-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => updateFaq(q.key, { question: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaq(q.key)}
                  >
                    Remove
                  </Button>
                </div>
                <Textarea
                  rows={3}
                  placeholder="Answer"
                  value={q.answer}
                  onChange={(e) => updateFaq(q.key, { answer: e.target.value })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

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

function HighlightList({
  title,
  kind,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  kind: HighlightKindValue;
  items: HighlightDraft[];
  onAdd: () => void;
  onUpdate: (key: string, patch: Partial<HighlightDraft>) => void;
  onRemove: (key: string) => void;
}) {
  const tone = kind === "PRO" ? "text-emerald-500" : "text-red-500";
  return (
    <div className="space-y-2 rounded-lg border bg-background/40 p-3">
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-semibold uppercase tracking-wider ${tone}`}>
          {title}
        </h4>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          + Add {kind === "PRO" ? "pro" : "con"}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((h) => (
            <li key={h.key} className="flex items-center gap-2">
              <Input
                placeholder={kind === "PRO" ? "e.g. Variety of games" : "e.g. Few live streams"}
                value={h.text}
                onChange={(e) => onUpdate(h.key, { text: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(h.key)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProviderList({
  title,
  kind,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  kind: ProviderKindValue;
  items: ProviderDraft[];
  onAdd: () => void;
  onUpdate: (key: string, patch: Partial<ProviderDraft>) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border bg-background/40 p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          + Add {kind === "SPORTS" ? "sports" : "casino"} provider
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.key}
              className="grid grid-cols-1 gap-2 rounded-md border bg-background p-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Input
                placeholder="Provider name (e.g. Pragmatic Play)"
                value={p.name}
                onChange={(e) => onUpdate(p.key, { name: e.target.value })}
              />
              <Input
                placeholder="Logo URL (optional)"
                value={p.logoUrl}
                onChange={(e) => onUpdate(p.key, { logoUrl: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(p.key)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
