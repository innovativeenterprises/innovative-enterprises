
import { z } from 'zod';

export const ListingDescriptionInputSchema = z.object({
  title: z.string(),
  location: z.string(),
  tags: z.string().describe("A comma-separated string of tags."),
});

export const ListingDescriptionOutputSchema = z.object({
  description: z.string().describe("The generated marketing description for the listing."),
});
