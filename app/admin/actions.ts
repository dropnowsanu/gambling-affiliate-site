"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";
import { adCardSchema } from "@/lib/validation";
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
    rating: form.get("rating") ? Number(form.get("rating")) : undefined,
    paymentMethods: parseList(form.get("paymentMethods")),
    tags: parseList(form.get("tags")),
    displayOrder: Number(form.get("displayOrder") ?? 0) || 0,
    featured: form.get("featured") === "on" || form.get("featured") === "true",
    published: form.get("published") !== "off" && form.get("published") !== "false",
  };
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
        rating: parsed.data.rating ?? 0,
        paymentMethods: parsed.data.paymentMethods,
        tags: parsed.data.tags,
        displayOrder: parsed.data.displayOrder,
        featured: parsed.data.featured,
        published: parsed.data.published,
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

  try {
    await prisma.adCard.update({
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
        rating: parsed.data.rating ?? 0,
        paymentMethods: parsed.data.paymentMethods,
        tags: parsed.data.tags,
        displayOrder: parsed.data.displayOrder,
        featured: parsed.data.featured,
        published: parsed.data.published,
      },
    });
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
