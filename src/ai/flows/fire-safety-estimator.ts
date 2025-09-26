
'use server';

/**
 * @fileOverview An AI agent that estimates fire and safety system requirements for a building.
 */
import { ai } from '@/ai/genkit';
import { FireSafetyEstimatorInputSchema, FireSafetyEstimatorOutputSchema, type FireSafetyEstimatorInput, type FireSafetyEstimatorOutput } from './fire-safety-estimator.schema';
import { transformImage } from './image-transformer';

export async function estimateFireSafety(input: FireSafetyEstimatorInput): Promise<FireSafetyEstimatorOutput> {
  return fireSafetyEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fireSafetyEstimatorPrompt',
  input: { schema: FireSafetyEstimatorInputSchema },
  output: { schema: FireSafetyEstimatorOutputSchema },
  prompt: `You are an expert Fire & Safety Engineer specializing in Omani building codes. Your task is to analyze building details and a floor plan to generate a preliminary cost estimation for fire alarm and firefighting systems.

**Building Details:**
- **Project Type:** {{{projectType}}}
- **Number of Floors:** {{{numberOfFloors}}}
- **Total Area:** {{{totalAreaSqM}}} sq. meters
- **Estimated Occupancy:** {{{occupancyLoad}}} people
- **Has Commercial Kitchens:** {{#if hasKitchens}}Yes{{else}}No{{/if}}
- **Has Server Room/Data Center:** {{#if hasServerRoom}}Yes{{else}}No{{/if}}

**Floor Plan:**
{{media url=floorPlanUri}}

**Instructions:**
1.  **Analyze Requirements:** Based on the project type, area, and floor plan, determine the necessary fire alarm and firefighting equipment.
    *   **Fire Alarm:** Estimate the number of smoke detectors (general areas), heat detectors (kitchens), manual call points (exits, corridors), and fire alarm bells/sounders. Assume one main Fire Alarm Control Panel (FACP).
    *   **Firefighting:** Estimate the number of fire extinguishers. Use CO2 for server rooms/electrical areas, and Dry Powder for general use. Estimate the number of sprinkler heads based on the total area (assume 1 sprinkler per 12 sq.m.).
2.  **Estimate Costs:** Use the following unit costs (in OMR). These costs are for materials only.
    *   Smoke Detector: 15
    *   Heat Detector: 20
    *   Manual Call Point: 12
    *   Fire Alarm Bell: 25
    *   Fire Alarm Control Panel: 250
    *   Fire Extinguisher (CO2): 45
    *   Fire Extinguisher (Dry Powder): 30
    *   Sprinkler Head: 18
3.  **Calculate Totals:**
    *   For each item, calculate the \`totalCost\`.
    *   Sum up all total costs to get the \`totalMaterialCost\`.
    *   Estimate the \`estimatedInstallationCost\` as 40% of the \`totalMaterialCost\`.
    *   Calculate the \`grandTotal\`.
4.  **Provide Recommendations:** Give 2-3 important recommendations. Examples: "A central monitoring connection to the Civil Defense is recommended," or "Ensure all wiring is fire-rated cable."

Return the complete response in the specified structured JSON format.`,
});

const fireSafetyEstimatorFlow = ai.defineFlow(
  {
    name: 'fireSafetyEstimatorFlow',
    inputSchema: FireSafetyEstimatorInputSchema,
    outputSchema: FireSafetyEstimatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid estimation.");
    }
    return output;
  }
);
