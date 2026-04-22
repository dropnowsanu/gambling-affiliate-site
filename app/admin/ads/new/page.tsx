import { createAdCard } from "@/app/admin/actions";
import { AdForm, emptyInitial } from "@/app/admin/ads/ad-form";

export default function NewAdPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New ad card</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in the casino details and upload a logo.
      </p>
      <div className="mt-6">
        <AdForm
          action={createAdCard}
          initial={emptyInitial}
          submitLabel="Create ad card"
        />
      </div>
    </div>
  );
}
