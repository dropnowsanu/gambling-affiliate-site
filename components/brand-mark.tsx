import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** Pixel size of the logo square. Defaults to 36. */
  size?: number;
  /** Text class overrides for the site name. */
  nameClassName?: string;
  /** Whether to hide the site name (icon-only mark). */
  iconOnly?: boolean;
  className?: string;
};

export function BrandMark({
  size = 36,
  nameClassName,
  iconOnly,
  className,
}: BrandMarkProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo.png"
        alt={`${siteConfig.name} logo`}
        width={size}
        height={size}
        priority
        className="rounded-full ring-1 ring-white/15 shadow-[0_6px_18px_-6px_rgba(236,72,153,0.55)]"
      />
      {iconOnly ? null : (
        <span
          className={cn(
            "gradient-text text-base font-bold tracking-tight",
            nameClassName,
          )}
        >
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
