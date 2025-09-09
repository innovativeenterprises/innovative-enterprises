import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Property data structure.
 * This ensures type safety and provides a single source of truth for the
 * data shape used across the application.
 */
export const PropertySchema = z.object({
  title: z.string().min(5, "Title is required."),
  listingType: z.enum(['For Sale', 'For Rent']),
  propertyType: z.enum(['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Industrial']),
  location: z.string().min(3, "Location is required."),
  price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number().int(),
  areaSqM: z.coerce.number().positive(),
  description: z.string().min(10, "Description is required."),
  status: z.enum(['Available', 'Sold', 'Rented']),
  buildingAge: z.string(),
  imageUrl: z.string().url("A valid image URL is required."),
  aiHint: z.string().optional(),
});
