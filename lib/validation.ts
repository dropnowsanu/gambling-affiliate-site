import { z } from "zod";

export const providerKindSchema = z.enum(["SPORTS", "CASINO"]);
export type ProviderKindValue = z.infer<typeof providerKindSchema>;

export const providerInputSchema = z.object({
  kind: providerKindSchema,
  name: z.string().trim().min(1).max(80),
  logoUrl: z
    .string()
    .trim()
    .url()
    .max(2048)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  displayOrder: z.coerce.number().int().default(0),
});

export type ProviderInput = z.infer<typeof providerInputSchema>;

export const providersListSchema = z.array(providerInputSchema).max(100);

export const highlightKindSchema = z.enum(["PRO", "CON"]);
export const highlightInputSchema = z.object({
  kind: highlightKindSchema,
  text: z.string().trim().min(1).max(300),
  displayOrder: z.coerce.number().int().default(0),
});
export const highlightsListSchema = z.array(highlightInputSchema).max(50);

export const factInputSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(200),
  icon: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  displayOrder: z.coerce.number().int().default(0),
});
export const factsListSchema = z.array(factInputSchema).max(30);

export const faqInputSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(4000),
  displayOrder: z.coerce.number().int().default(0),
});
export const faqsListSchema = z.array(faqInputSchema).max(50);

export const sectionInputSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(8000),
  displayOrder: z.coerce.number().int().default(0),
});
export const sectionsListSchema = z.array(sectionInputSchema).max(30);

export type HighlightInput = z.infer<typeof highlightInputSchema>;
export type FactInput = z.infer<typeof factInputSchema>;
export type FaqInput = z.infer<typeof faqInputSchema>;
export type SectionInput = z.infer<typeof sectionInputSchema>;

export const adCardSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes")
    .min(1)
    .max(120)
    .optional()
    .or(z.literal("")),
  description: z.string().max(4000).optional().or(z.literal("")),
  welcomeOffer: z.string().min(1, "Welcome offer is required").max(200),
  logoUrl: z.string().url("Upload a logo first"),
  logoPublicId: z.string().optional().or(z.literal("")),
  signupUrl: z.string().url("Must be a valid URL"),
  loginUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  registrationUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
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
  authorName: z.string().trim().max(120).optional().or(z.literal("")),
  authorUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  authorAvatarUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type AdCardInput = z.infer<typeof adCardSchema>;
