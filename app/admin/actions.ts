"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";
import {
  adCardSchema,
  providersListSchema,
  highlightsListSchema,
  factsListSchema,
  faqsListSchema,
  sectionsListSchema,
} from "@/lib/validation";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

function parseList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseForm(form: FormData) {
  return {
    name: String(form.get("name") ?? ""),
    slug: String(form.get("slug") ?? ""),
    description: String(form.get("description") ?? ""),
    welcomeOffer: String(form.get("welcomeOffer") ?? ""),
    logoUrl: String(form.get("logoUrl") ?? ""),
    logoPublicId: String(form.get("logoPublicId") ?? ""),
    signupUrl: String(form.get("signupUrl") ?? ""),
    loginUrl: String(form.get("loginUrl") ?? ""),
    registrationUrl: String(form.get("registrationUrl") ?? ""),
    rating: form.get("rating") ? Number(form.get("rating")) : undefined,
    paymentMethods: parseList(form.get("paymentMethods")),
    tags: parseList(form.get("tags")),
    displayOrder: Number(form.get("displayOrder") ?? 0) || 0,
    featured: form.get("featured") === "on" || form.get("featured") === "true",
    published: form.get("published") !== "off" && form.get("published") !== "false",
    authorName: String(form.get("authorName") ?? ""),
    authorUrl: String(form.get("authorUrl") ?? ""),
    authorAvatarUrl: String(form.get("authorAvatarUrl") ?? ""),
  };
}

function parseJsonList<T>(
  form: FormData,
  field: string,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
): T | [] {
  const raw = form.get(field);
  if (typeof raw !== "string" || raw.trim() === "") return [] as never;
  try {
    const json = JSON.parse(raw);
    const parsed = schema.safeParse(json);
    return parsed.success && parsed.data !== undefined ? parsed.data : ([] as never);
  } catch {
    return [] as never;
  }
}

const parseProviders = (form: FormData) =>
  parseJsonList(form, "providers", providersListSchema) as ReturnType<
    typeof providersListSchema.parse
  >;
const parseHighlights = (form: FormData) =>
  parseJsonList(form, "highlights", highlightsListSchema) as ReturnType<
    typeof highlightsListSchema.parse
  >;
const parseFacts = (form: FormData) =>
  parseJsonList(form, "facts", factsListSchema) as ReturnType<
    typeof factsListSchema.parse
  >;
const parseFaqs = (form: FormData) =>
  parseJsonList(form, "faqs", faqsListSchema) as ReturnType<
    typeof faqsListSchema.parse
  >;
const parseSections = (form: FormData) =>
  parseJsonList(form, "sections", sectionsListSchema) as ReturnType<
    typeof sectionsListSchema.parse
  >;

function sectionSlugify(heading: string, index: number) {
  const base = slugify(heading);
  return base || `section-${index + 1}`;
}

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export async function createAdCard(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = adCardSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const slug = (parsed.data.slug?.trim() || slugify(parsed.data.name)) as string;

  const providers = parseProviders(formData);
  const highlights = parseHighlights(formData);
  const facts = parseFacts(formData);
  const faqs = parseFaqs(formData);
  const sections = parseSections(formData);

  try {
    const created = await prisma.adCard.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        welcomeOffer: parsed.data.welcomeOffer,
        logoUrl: parsed.data.logoUrl,
        logoPublicId: parsed.data.logoPublicId || null,
        signupUrl: parsed.data.signupUrl,
        loginUrl: parsed.data.loginUrl || null,
        registrationUrl: parsed.data.registrationUrl || null,
        rating: parsed.data.rating ?? 0,
        paymentMethods: parsed.data.paymentMethods,
        tags: parsed.data.tags,
        displayOrder: parsed.data.displayOrder,
        featured: parsed.data.featured,
        published: parsed.data.published,
        authorName: parsed.data.authorName || null,
        authorUrl: parsed.data.authorUrl || null,
        authorAvatarUrl: parsed.data.authorAvatarUrl || null,
        reviewUpdatedAt: new Date(),
        providers: providers.length
          ? {
              create: providers.map((p, i) => ({
                kind: p.kind,
                name: p.name,
                logoUrl: p.logoUrl ?? null,
                displayOrder: Number.isFinite(p.displayOrder) ? p.displayOrder : i,
              })),
            }
          : undefined,
        highlights: highlights.length
          ? {
              create: highlights.map((h, i) => ({
                kind: h.kind,
                text: h.text,
                displayOrder: Number.isFinite(h.displayOrder) ? h.displayOrder : i,
              })),
            }
          : undefined,
        facts: facts.length
          ? {
              create: facts.map((f, i) => ({
                label: f.label,
                value: f.value,
                icon: f.icon ?? null,
                displayOrder: Number.isFinite(f.displayOrder) ? f.displayOrder : i,
              })),
            }
          : undefined,
        faqs: faqs.length
          ? {
              create: faqs.map((f, i) => ({
                question: f.question,
                answer: f.answer,
                displayOrder: Number.isFinite(f.displayOrder) ? f.displayOrder : i,
              })),
            }
          : undefined,
        sections: sections.length
          ? {
              create: sections.map((s, i) => ({
                slug: sectionSlugify(s.heading, i),
                heading: s.heading,
                body: s.body,
                displayOrder: Number.isFinite(s.displayOrder) ? s.displayOrder : i,
              })),
            }
          : undefined,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/casino/${created.slug}`);
    return { ok: true, id: created.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create";
    return { ok: false, error: msg };
  }
}

export async function updateAdCard(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const raw = parseForm(formData);
  const parsed = adCardSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.adCard.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found" };

  const slug = (parsed.data.slug?.trim() || slugify(parsed.data.name)) as string;

  if (
    existing.logoPublicId &&
    parsed.data.logoPublicId &&
    existing.logoPublicId !== parsed.data.logoPublicId
  ) {
    await deleteImage(existing.logoPublicId);
  }

  const providers = parseProviders(formData);
  const highlights = parseHighlights(formData);
  const facts = parseFacts(formData);
  const faqs = parseFaqs(formData);
  const sections = parseSections(formData);

  try {
    await prisma.$transaction([
      prisma.adCard.update({
        where: { id },
        data: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description || null,
          welcomeOffer: parsed.data.welcomeOffer,
          logoUrl: parsed.data.logoUrl,
          logoPublicId: parsed.data.logoPublicId || null,
          signupUrl: parsed.data.signupUrl,
          loginUrl: parsed.data.loginUrl || null,
          registrationUrl: parsed.data.registrationUrl || null,
          rating: parsed.data.rating ?? 0,
          paymentMethods: parsed.data.paymentMethods,
          tags: parsed.data.tags,
          displayOrder: parsed.data.displayOrder,
          featured: parsed.data.featured,
          published: parsed.data.published,
          authorName: parsed.data.authorName || null,
          authorUrl: parsed.data.authorUrl || null,
          authorAvatarUrl: parsed.data.authorAvatarUrl || null,
          reviewUpdatedAt: new Date(),
        },
      }),
      prisma.provider.deleteMany({ where: { adCardId: id } }),
      prisma.adHighlight.deleteMany({ where: { adCardId: id } }),
      prisma.adFact.deleteMany({ where: { adCardId: id } }),
      prisma.adFaq.deleteMany({ where: { adCardId: id } }),
      prisma.adSection.deleteMany({ where: { adCardId: id } }),
      ...(providers.length
        ? [
            prisma.provider.createMany({
              data: providers.map((p, i) => ({
                adCardId: id,
                kind: p.kind,
                name: p.name,
                logoUrl: p.logoUrl ?? null,
                displayOrder: Number.isFinite(p.displayOrder) ? p.displayOrder : i,
              })),
            }),
          ]
        : []),
      ...(highlights.length
        ? [
            prisma.adHighlight.createMany({
              data: highlights.map((h, i) => ({
                adCardId: id,
                kind: h.kind,
                text: h.text,
                displayOrder: Number.isFinite(h.displayOrder) ? h.displayOrder : i,
              })),
            }),
          ]
        : []),
      ...(facts.length
        ? [
            prisma.adFact.createMany({
              data: facts.map((f, i) => ({
                adCardId: id,
                label: f.label,
                value: f.value,
                icon: f.icon ?? null,
                displayOrder: Number.isFinite(f.displayOrder) ? f.displayOrder : i,
              })),
            }),
          ]
        : []),
      ...(faqs.length
        ? [
            prisma.adFaq.createMany({
              data: faqs.map((f, i) => ({
                adCardId: id,
                question: f.question,
                answer: f.answer,
                displayOrder: Number.isFinite(f.displayOrder) ? f.displayOrder : i,
              })),
            }),
          ]
        : []),
      ...(sections.length
        ? [
            prisma.adSection.createMany({
              data: sections.map((s, i) => ({
                adCardId: id,
                slug: sectionSlugify(s.heading, i),
                heading: s.heading,
                body: s.body,
                displayOrder: Number.isFinite(s.displayOrder) ? s.displayOrder : i,
              })),
            }),
          ]
        : []),
    ]);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/casino/${slug}`);
    if (existing.slug !== slug) revalidatePath(`/casino/${existing.slug}`);
    return { ok: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update";
    return { ok: false, error: msg };
  }
}

export async function deleteAdCard(id: string) {
  await requireAdmin();
  const ad = await prisma.adCard.findUnique({ where: { id } });
  if (!ad) return;
  if (ad.logoPublicId) await deleteImage(ad.logoPublicId);
  await prisma.adCard.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/casino/${ad.slug}`);
}

export async function togglePublishAdCard(id: string) {
  await requireAdmin();
  const ad = await prisma.adCard.findUnique({ where: { id } });
  if (!ad) return;
  await prisma.adCard.update({
    where: { id },
    data: { published: !ad.published },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/casino/${ad.slug}`);
}

export async function signOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/admin/login" });
  redirect("/admin/login");
}
