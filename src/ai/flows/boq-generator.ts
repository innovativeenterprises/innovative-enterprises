
'use server';

/**
 * @fileOverview An AI agent that generates a Bill of Quantities (BoQ) from a building plan.
 */

import { ai } from '@/ai/genkit';
import {
    BoQGeneratorInput,
    BoQGeneratorInputSchema,
    BoQGeneratorOutput,
    BoQGeneratorOutputSchema,
    BoQCategoryGeneratorInputSchema,
    BoQCategoryGeneratorInput,
    BoQCategoryGeneratorOutput,
    BoQCategoryGeneratorOutputSchema,
} from './boq-generator.schema';


export async function generateBoqCategory(input: BoQCategoryGeneratorInput): Promise<BoQCategoryGeneratorOutput> {
    return boqCategoryGeneratorFlow(input);
}

export async function generateFullBoq(input: BoQGeneratorInput): Promise<BoQGeneratorOutput> {
    return fullBoqGeneratorFlow(input);
}

const categoryPrompt = ai.definePrompt({
  name: 'boqCategoryGeneratorPrompt',
  input: { schema: BoQCategoryGeneratorInputSchema },
  output: { schema: BoQCategoryGeneratorOutputSchema },
  prompt: `You are a highly experienced Quantity Surveyor AI. Your task is to analyze a building floor plan for a specific category of work.

**Project Details:**
- **Category to Calculate:** {{{category}}}
- **Project Type:** {{{projectType}}}
- **Number of Floors:** {{{numberOfFloors}}}
- **Floor Plan Document:** {{media url=floorPlanUri}}
{{#if additionalSpecs}}
- **Additional Specifications:** {{{additionalSpecs}}}
{{/if}}

**Instructions:**
1.  **Focus ONLY on the requested category:** \`{{{category}}}\`. If the category is 'Preliminaries', include items like Mobilization, Site Offices, Temporary Fencing, and Demobilization.
2.  **Analyze the Floor Plan:** Carefully study the provided floor plan to understand the layout and dimensions relevant to this category.
3.  **Calculate Quantities:** Based on the plan, calculate the estimated quantities for items ONLY within the '{{{category}}}' category. For lump-sum items like Mobilization, use a quantity of 1 and a unit of 'L.S.'.
4.  **Itemize:** For each item, provide a clear description, the correct unit of measurement (e.g., m³, m², kg, nos, L.S.), and the calculated quantity.
5.  **Assumptions:** If you have to make assumptions, state them clearly in the 'notes' for the relevant item.

Return ONLY the items for the requested category. Do not calculate for other categories.
`,
});

const boqCategoryGeneratorFlow = ai.defineFlow(
  {
    name: 'boqCategoryGeneratorFlow',
    inputSchema: BoQCategoryGeneratorInputSchema,
    outputSchema: BoQCategoryGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await categoryPrompt(input);
    return output!;
  }
);


const fullBoqGeneratorFlow = ai.defineFlow(
    {
        name: 'fullBoqGeneratorFlow',
        inputSchema: BoQGeneratorInputSchema,
        outputSchema: BoQGeneratorOutputSchema,
    },
    async (input) => {
        const categoriesToGenerate = [
            'Preliminaries',
            'Earthwork',
            'Concrete Works',
            'Masonry Works',
            'Plaster Works',
            'Finishing Works',
        ];

        // Generate BoQ for all categories in parallel
        const categoryPromises = categoriesToGenerate.map(category =>
            generateBoqCategory({ ...input, category })
        );

        const results = await Promise.all(categoryPromises);

        // Consolidate all items into a single list
        const allBoqItems = results.flatMap(result => result.boqItems);

        return { boqItems: allBoqItems };
    }
);
