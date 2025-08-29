
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

export async function generateBoq(input: BoQGeneratorInput): Promise<BoQGeneratorOutput> {
  return boqGeneratorFlow(input);
}

export async function generateBoqCategory(input: BoQCategoryGeneratorInput): Promise<BoQCategoryGeneratorOutput> {
    return boqCategoryGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'boqGeneratorPrompt',
  input: { schema: BoQGeneratorInputSchema },
  output: { schema: BoQGeneratorOutputSchema },
  prompt: `You are a highly experienced Quantity Surveyor AI. Your task is to analyze a building floor plan and project specifications to generate a preliminary Bill of Quantities (BoQ).

**Project Details:**
- **Project Type:** {{{projectType}}}
- **Number of Floors:** {{{numberOfFloors}}}
- **Floor Plan Document:** {{media url=floorPlanUri}}
{{#if additionalSpecs}}
- **Additional Specifications:** {{{additionalSpecs}}}
{{/if}}

**Instructions:**
1.  **Analyze the Floor Plan:** Carefully study the provided floor plan to understand the layout, dimensions of rooms, walls, slabs, and overall structure.
2.  **Calculate Quantities:** Based on the plan and project details, calculate the estimated quantities for major construction items. You must categorize these items logically.
3.  **Structure the BoQ:** Group the items into standard construction categories:
    -   **Earthwork:** Excavation, backfilling.
    -   **Concrete Works:** Plain concrete, reinforced concrete for foundations, columns, beams, and slabs.
    -   **Masonry Works:** Concrete blockwork for walls.
    -   **Plaster Works:** Internal and external plastering.
    -   **Finishing Works:** (If mentioned in specs) Floor tiles, paint.
4.  **Itemize:** For each item, provide a clear description, the correct unit of measurement (e.g., m³, m², kg, nos), and the calculated quantity.
5.  **Assumptions:** If you have to make assumptions (e.g., standard slab thickness of 20cm, standard block size), state them clearly in the 'notes' for the relevant item.
6.  **Summary:** Write a brief, high-level summary of the findings, mentioning the major quantities (e.g., "The project requires approximately X m³ of concrete and Y m² of blockwork.").

Return the complete, structured Bill of Quantities.
`,
});

const boqGeneratorFlow = ai.defineFlow(
  {
    name: 'boqGeneratorFlow',
    inputSchema: BoQGeneratorInputSchema,
    outputSchema: BoQGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


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
1.  **Focus ONLY on the requested category:** \`{{{category}}}\`.
2.  **Analyze the Floor Plan:** Carefully study the provided floor plan to understand the layout and dimensions relevant to this category.
3.  **Calculate Quantities:** Based on the plan, calculate the estimated quantities for items ONLY within the '{{{category}}}' category.
4.  **Itemize:** For each item, provide a clear description, the correct unit of measurement (e.g., m³, m², kg, nos), and the calculated quantity.
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
