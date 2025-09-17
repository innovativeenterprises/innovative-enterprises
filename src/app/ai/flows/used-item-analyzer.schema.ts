
import { z } from 'zod';

export const UsedItemAnalysisInputSchema = z.object({
  imageDataUri: z.string().describe("A data URI of the used item's image."),
});
export type UsedItemAnalysisInput = z.infer<typeof UsedItemAnalysisInputSchema>;

export const UsedItemAnalysisOutputSchema = z.object({
  itemName: z.string().describe("The name of the identified item."),
  category: z.string().describe("A suitable category for the item (e.g., 'Electronics', 'Furniture', 'Apparel')."),
  description: z.string().describe("A compelling, one-paragraph description for a marketplace listing."),
  estimatedPriceOMR: z.number().describe("An estimated price in Omani Rials, considering it's a used item."),
});
export type UsedItemAnalysisOutput = z.infer<typeof UsedItemAnalysisOutputSchema>;
