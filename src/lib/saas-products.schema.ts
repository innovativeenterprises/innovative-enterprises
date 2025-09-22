
import { z } from 'zod';

export const SaaSProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    stage: z.string(),
    category: z.string(),
    status: z.string(),
    ready: z.boolean(),
});
export type SaaSProduct = z.infer<typeof SaaSProductSchema>;

export const SaasCategorySchema = z.object({
    name: z.string(),
    products: z.array(SaaSProductSchema),
});
export type SaasCategory = z.infer<typeof SaasCategorySchema>;
