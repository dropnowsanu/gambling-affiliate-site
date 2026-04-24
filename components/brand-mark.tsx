"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
  const name = siteConfig.name.toUpperCase();
  return (
    <motion.span
      className={cn("group inline-flex items-center gap-2.5", className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="relative inline-flex"
        whileHover={{ rotate: [0, -6, 6, -3, 0], scale: 1.06 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Image
          src="/logo.png"
          alt={`${siteConfig.name} logo`}
          width={size}
          height={size}
          priority
          className="rounded-full ring-1 ring-white/15 shadow-[0_6px_18px_-6px_rgba(236,72,153,0.55)]"
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(236,72,153,0.55)",
              "0 0 0 8px rgba(236,72,153,0)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.span>
      {iconOnly ? null : (
        <motion.span
          className={cn(
            "gradient-text font-extrabold uppercase tracking-[0.18em]",
            nameClassName,
          )}
          whileHover={{ letterSpacing: "0.28em" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {name.split("").map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.035, duration: 0.35 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.span>
      )}
    </motion.span>
  );
}
