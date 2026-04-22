"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteAdCard, togglePublishAdCard } from "./actions";

export function AdRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-1">
      <Link
        href={`/admin/ads/${id}`}
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Edit
      </Link>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await togglePublishAdCard(id);
            toast.success(published ? "Unpublished" : "Published");
          })
        }
      >
        {published ? "Unpublish" : "Publish"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this ad card? This cannot be undone.")) return;
          startTransition(async () => {
            await deleteAdCard(id);
            toast.success("Deleted");
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
