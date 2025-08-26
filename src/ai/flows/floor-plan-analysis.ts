
'use server';

/**
 * @fileOverview An AI agent that performs a quick analysis of a floor plan image.
 * - analyzeFloorPlan - A function that analyzes an image to extract key details.
 */

import { ai } from '@/ai/genkit';
import {
    FloorPlanAnalysisInput,
    FloorPlanAnalysisInputSchema,
    FloorPlanAnalysisOutput,
    FloorPlanAnalysisOutputSchema,
} from './floor-plan-analysis.schema';

export async function analyzeFloorPlan(input: FloorPlanAnalysisInput): Promise<FloorPlanAnalysisOutput> {
  return floorPlanAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'floorPlanAnalysisPrompt',
  input: { schema: FloorPlanAnalysisInputSchema },
  output: { schema: FloorPlanAnalysisOutputSchema },
  prompt: `You are an expert CCTV and surveillance systems engineer. Your task is to perform a *very quick* pre-analysis of a floor plan, building sketch, or photo.

**Client Provided Asset:**
- **Floor Plan / Sketch / Photo:** {{media url=documentDataUri}}

**Your Task:**
1.  **Estimate Dimensions:** Briefly analyze the image to estimate the overall dimensions. If it's a multi-story building, note that. Output a concise string like "Approx. 20m x 15m, 2 floors". If you cannot determine the dimensions, leave the field blank.
2.  **Suggest DVR Location:** Based on the layout, suggest a logical, secure, and central location for the main DVR/NVR and network switch. Common locations include "IT Room," "Storage closet under stairs," or "Main office utility closet." If no obvious location is visible, leave the field blank.

Return only these two pieces of information in the specified structured JSON format. This is a pre-analysis, so speed and brevity are key.
`,
});

const floorPlanAnalysisFlow = ai.defineFlow(
  {
    name: 'floorPlanAnalysisFlow',
    inputSchema: FloorPlanAnalysisInputSchema,
    outputSchema: FloorPlanAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
