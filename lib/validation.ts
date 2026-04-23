import { z } from "zod";

export const adCardSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes")
    .min(1)
    .max(120)
    .optional()
    .or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  welcomeOffer: z.string().min(1, "Welcome offer is required").max(200),
  logoUrl: z.string().url("Upload a logo first"),
  logoPublicId: z.string().optional().or(z.literal("")),
  signupUrl: z.string().url("Must be a valid URL"),
  loginUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  rating: z
    .coerce.number()
    .min(0)
    .max(5)
    .optional()
    .or(z.nan().transform(() => undefined)),
  paymentMethods: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  displayOrder: z.coerce.number().int().default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type AdCardInput = z.infer<typeof adCardSchema>;
