import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { AdRowActions } from "./ad-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const ads = await prisma.adCard.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ad cards</h1>
          <p className="text-sm text-muted-foreground">
            {ads.length} {ads.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <Link href="/admin/ads/new" className={buttonVariants()}>
          + New ad card
        </Link>
      </div>

      <div className="mt-6 rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Welcome offer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No ad cards yet. Click <b>New ad card</b> to create your first one.
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                      <Image
                        src={ad.logoUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/admin/ads/${ad.id}`} className="hover:underline">
                      {ad.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{ad.slug}</div>
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate">
                    {ad.welcomeOffer}
                  </TableCell>
                  <TableCell>
                    {ad.rating && ad.rating > 0 ? ad.rating.toFixed(1) : "—"}
                  </TableCell>
                  <TableCell>{ad.displayOrder}</TableCell>
                  <TableCell>
                    {ad.published ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                    {ad.featured ? (
                      <Badge variant="outline" className="ml-1">
                        Featured
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <AdRowActions id={ad.id} published={ad.published} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
