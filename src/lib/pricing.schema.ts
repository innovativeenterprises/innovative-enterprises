import { z } from 'zod';

export const PricingSchema = z.object({
  id: z.string(),
  type: z.string(),
  group: z.string(),
  price: z.number(),
});
export type Pricing = z.infer<typeof PricingSchema>;

export interface PricingGroup {
    group: string;
    icon: React.ElementType;
    items: Record<string, number>;
}
