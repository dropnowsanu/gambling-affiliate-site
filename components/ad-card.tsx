import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AdCardData = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  welcomeOffer: string;
  logoUrl: string;
  signupUrl: string;
  loginUrl?: string | null;
  rating?: number | null;
  paymentMethods: string[];
  tags: string[];
  featured?: boolean;
};

export function AdCard({ ad }: { ad: AdCardData }) {
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      {ad.featured ? (
        <Badge
          className="absolute right-3 top-3 z-10 bg-amber-500 text-white"
          variant="secondary"
        >
          Featured
        </Badge>
      ) : null}

      <CardHeader className="gap-3">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
            <Image
              src={ad.logoUrl}
              alt={`${ad.name} logo`}
              fill
              sizes="56px"
              className="object-contain p-1"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{ad.name}</CardTitle>
            {typeof ad.rating === "number" && ad.rating > 0 ? (
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {ad.rating.toFixed(1)}
                </span>
                <span>/ 5</span>
              </div>
            ) : null}
          </div>
        </div>
        <CardDescription className="text-base font-medium text-foreground">
          🎁 {ad.welcomeOffer}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
        {ad.description ? <p className="line-clamp-3">{ad.description}</p> : null}

        {ad.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {ad.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {ad.paymentMethods.length > 0 ? (
          <div className="text-xs">
            <span className="font-medium text-foreground">Payments: </span>
            {ad.paymentMethods.slice(0, 5).join(", ")}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="gap-2">
        <a
          href={ad.signupUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className={buttonVariants({ className: "flex-1" })}
        >
          Sign up
        </a>
        {ad.loginUrl ? (
          <a
            href={ad.loginUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              className: "flex-1",
            })}
          >
            Login
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
