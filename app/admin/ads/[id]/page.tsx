import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAdCard, type ActionResult } from "@/app/admin/actions";
import { AdForm, type AdFormInitial } from "@/app/admin/ads/ad-form";

export default async function EditAdPage(
  props: PageProps<"/admin/ads/[id]">,
) {
  const { id } = await props.params;
  const ad = await prisma.adCard.findUnique({ where: { id } });
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
    rating: ad.rating ?? 0,
    paymentMethods: ad.paymentMethods,
    tags: ad.tags,
    displayOrder: ad.displayOrder,
    featured: ad.featured,
    published: ad.published,
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
