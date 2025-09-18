
import { z } from 'zod';

export const CarSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  type: z.enum(['Sedan', 'SUV', 'Coupe', 'Truck']),
  rentalAgencyId: z.string(),
  pricePerDay: z.number(),
  location: z.string(),
  availability: z.enum(['Available', 'Rented']),
  imageUrl: z.string().url(),
  features: z.array(z.string()),
});
export type Car = z.infer<typeof CarSchema>;
