
import { z } from 'zod';

export const BeautyServiceSchema = z.object({
    id: z.string(),
    agencyId: z.string(),
    name: z.string(),
    category: z.enum(['Hair', 'Nails', 'Skincare', 'Massage', 'Makeup']),
    price: z.number(),
    duration: z.number(), // in minutes
});
export type BeautyService = z.infer<typeof BeautyServiceSchema>;
