
'use server';

/**
 * @fileOverview An AI agent that provides an estimated valuation for real estate properties.
 */

import { ai } from '@/ai/genkit';
import {
    PropertyValuationInputSchema,
    PropertyValuationInput,
    PropertyValuationOutputSchema,
    PropertyValuationOutput,
} from './property-valuation.schema';

export async function evaluateProperty(input: PropertyValuationInput): Promise<PropertyValuationOutput> {
  return propertyValuationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'propertyValuationPrompt',
  input: { schema: PropertyValuationInputSchema },
  output: { schema: PropertyValuationOutputSchema },
  prompt: `You are a certified real estate appraiser AI specializing in the Omani market.
Your task is to provide a detailed and realistic market valuation for the following property.

**Property Details:**
- Property Type: {{{propertyType}}}
- Location: {{{location}}}
- Size: {{{sizeSqM}}} sq. meters
{{#if bedrooms}}
- Bedrooms: {{{bedrooms}}}
{{/if}}
{{#if bathrooms}}
- Bathrooms: {{{bathrooms}}}
{{/if}}
- Description: {{{description}}}
{{#if propertyImageUri}}
- Property Image: {{media url=propertyImageUri}} (Analyze this image for visual cues about condition, style, and unique features.)
{{/if}}

**Instructions:**
1.  **Estimate Value:** Based on the provided details and your knowledge of the Omani real estate market (especially in the '{{{location}}}' area), calculate an estimated market value in OMR.
2.  **Valuation Summary:** Write a professional, one-paragraph summary explaining your valuation. Mention key factors like location, property type, size, and any special features from the description or image.
3.  **Confidence Score:** Provide a confidence score (0-100) based on how much information was provided. More details (like images, specific features) should result in a higher score.
4.  **Identify Key Features:** List 3-4 positive features that add to the property's value.
5.  **Suggest Improvements:** List 2-3 actionable suggestions for improvements that could increase the property's value.
6.  **Find Comparables:** Generate a list of 2-3 realistic, comparable property sales. For each, provide a plausible address in the same area, its sale price, and its size. This is a simulation, so the data should be realistic but not necessarily real-time.

Return the complete analysis in the specified structured JSON format.
`,
});

const propertyValuationFlow = ai.defineFlow(
  {
    name: 'propertyValuationFlow',
    inputSchema: PropertyValuationInputSchema,
    outputSchema: PropertyValuationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    