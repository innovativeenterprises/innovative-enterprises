
'use server';

/**
 * @fileOverview An AI agent that provides an estimated valuation for real estate properties.
 */

import { ai } from '@/ai/genkit';
import { getProperties } from '@/lib/firestore';
import {
    PropertyValuationInputSchema,
    PropertyValuationInput,
    PropertyValuationOutputSchema,
    PropertyValuationOutput,
} from './property-valuation.schema';
import { z } from 'zod';

export async function evaluateProperty(input: PropertyValuationInput): Promise<PropertyValuationOutput> {
  return propertyValuationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'propertyValuationPrompt',
  input: { schema: PropertyValuationInputSchema.extend({ comparablePropertiesJson: z.string() }) },
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

**Comparable Sales Data (Recent transactions in the area):**
You MUST use this data as the basis for your valuation.
'''json
{{{comparablePropertiesJson}}}
'''

**Instructions:**
1.  **Estimate Value:** Based on the provided details and, most importantly, the comparable sales data, calculate an estimated market value in OMR. Adjust the value based on factors like size, condition (inferred from description/image), and specific features compared to the comparables.
2.  **Valuation Summary:** Write a professional, one-paragraph summary explaining your valuation. Justify your estimate by explicitly referencing the provided comparable properties.
3.  **Confidence Score:** Provide a confidence score (0-100) based on how much information was provided. More details (like images, specific features) should result in a higher score.
4.  **Identify Key Features:** List 3-4 positive features that add to the property's value.
5.  **Suggest Improvements:** List 2-3 actionable suggestions for improvements that could increase the property's value.
6.  **Select Comparables:** From the provided list, select the 2-3 most relevant properties you used for your analysis and include them in the output.

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
    const allProperties = await getProperties();
    const comparableProperties = allProperties.filter(p => p.status !== 'Available');
    const comparablePropertiesJson = JSON.stringify(comparableProperties, null, 2);
    
    const { output } = await prompt({
        ...input,
        comparablePropertiesJson,
    });
    return output!;
  }
);
