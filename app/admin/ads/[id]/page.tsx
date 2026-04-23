import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAdCard, type ActionResult } from "@/app/admin/actions";
import { AdForm, type AdFormInitial } from "@/app/admin/ads/ad-form";

export default async function EditAdPage(
  props: PageProps<"/admin/ads/[id]">,
) {
  const { id } = await props.params;
  const ad = await prisma.adCard.findUnique({
    where: { id },
    include: {
      providers: { orderBy: [{ kind: "asc" }, { displayOrder: "asc" }] },
      highlights: { orderBy: [{ kind: "asc" }, { displayOrder: "asc" }] },
      facts: { orderBy: { displayOrder: "asc" } },
      faqs: { orderBy: { displayOrder: "asc" } },
      sections: { orderBy: { displayOrder: "asc" } },
    },
  });
  if (!ad) notFound();

  const initial: AdFormInitial = {
    id: ad.id,
    name: ad.name,
    slug: ad.slug,
    description: ad.description ?? "",
    welcomeOffer: ad.welcomeOffer,
    logoUrl: ad.logoUrl,
    logoPublicId: ad.logoPublicId ?? "",
    signupUrl: ad.signupUrl,
    loginUrl: ad.loginUrl ?? "",
    registrationUrl: ad.registrationUrl ?? "",
    rating: ad.rating ?? 0,
    paymentMethods: ad.paymentMethods,
    tags: ad.tags,
    displayOrder: ad.displayOrder,
    featured: ad.featured,
    published: ad.published,
    authorName: ad.authorName ?? "",
    authorUrl: ad.authorUrl ?? "",
    authorAvatarUrl: ad.authorAvatarUrl ?? "",
    providers: ad.providers.map((p) => ({
      kind: p.kind,
      name: p.name,
      logoUrl: p.logoUrl ?? "",
      displayOrder: p.displayOrder,
    })),
    highlights: ad.highlights.map((h) => ({
      kind: h.kind,
      text: h.text,
      displayOrder: h.displayOrder,
    })),
    facts: ad.facts.map((f) => ({
      label: f.label,
      value: f.value,
      icon: f.icon ?? "",
      displayOrder: f.displayOrder,
    })),
    faqs: ad.faqs.map((q) => ({
      question: q.question,
      answer: q.answer,
      displayOrder: q.displayOrder,
    })),
    sections: ad.sections.map((s) => ({
      heading: s.heading,
      body: s.body,
      displayOrder: s.displayOrder,
    })),
  };

  const boundAction = async (
    prev: ActionResult | null,
    formData: FormData,
  ): Promise<ActionResult> => {
    "use server";
    return updateAdCard(id, prev, formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit ad card</h1>
      <p className="mt-1 text-sm text-muted-foreground">{ad.name}</p>
      <div className="mt-6">
        <AdForm
          action={boundAction}
          initial={initial}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
