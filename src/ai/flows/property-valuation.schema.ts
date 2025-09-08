/**
 * @fileOverview Schemas for the AI Property Valuation flow.
 */
import { z } from 'zod';

export const PropertyValuationInputSchema = z.object({
  propertyType: z.enum(['Apartment', 'Villa', 'Townhouse', 'Land', 'Commercial Space']),
  location: z.string().min(3, "Please provide a specific location (e.g., Al Mouj, Muscat)."),
  sizeSqM: z.coerce.number().positive("Size in square meters must be a positive number."),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  description: z.string().min(10, "Please provide a brief description of the property's features."),
  propertyImageUri: z.string().optional().describe("An optional image of the property as a data URI."),
});
export type PropertyValuationInput = z.infer<typeof PropertyValuationInputSchema>;


const ComparablePropertySchema = z.object({
    address: z.string().describe("The address or location of the comparable property."),
    price: z.number().describe("The sale price of the comparable property in OMR."),
    sizeSqM: z.number().describe("The size in square meters."),
    notes: z.string().describe("A brief note on why this property is comparable."),
});

export const PropertyValuationOutputSchema = z.object({
  estimatedValue: z.number().describe("The AI-estimated market value of the property in OMR."),
  confidenceScore: z.number().min(0).max(100).describe("A score from 0 to 100 representing the confidence in the valuation."),
  valuationSummary: z.string().describe("A professional, one-paragraph summary of the valuation, explaining the key factors considered."),
  positiveFeatures: z.array(z.string()).describe("A list of key features that positively impact the valuation."),
  improvementSuggestions: z.array(z.string()).describe("A list of potential improvements that could increase the property's value."),
  comparableProperties: z.array(ComparablePropertySchema).describe("A list of 2-3 recent, comparable property sales used for the analysis."),
});
export type PropertyValuationOutput = z.infer<typeof PropertyValuationOutputSchema>;

    
