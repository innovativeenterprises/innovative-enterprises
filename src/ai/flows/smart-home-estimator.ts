

'use server';

/**
 * @fileOverview An AI agent that estimates the cost of a smart home system for a building.
 */
import { ai } from '@/ai/genkit';
import { SmartHomeEstimatorInputSchema, SmartHomeEstimatorOutputSchema, type SmartHomeEstimatorInput, type SmartHomeEstimatorOutput } from './smart-home-estimator.schema';

export async function estimateSmartHome(input: SmartHomeEstimatorInput): Promise<SmartHomeEstimatorOutput> {
  return smartHomeEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartHomeEstimatorPrompt',
  input: { schema: SmartHomeEstimatorInputSchema },
  output: { schema: SmartHomeEstimatorOutputSchema },
  prompt: `You are an expert Smart Home System Designer. Your task is to analyze a floor plan and generate a preliminary cost estimation for a smart home installation.

**Project Details:**
- **Floor Plan:** {{media url=floorPlanUri}}
- **Desired Automation Level:** {{{automationLevel}}}

**Instructions:**
1.  **Analyze Floor Plan:** Analyze the provided floor plan to identify the number and type of rooms (e.g., bedrooms, living rooms, kitchens, bathrooms, corridors).
2.  **Determine Equipment Needs:** Based on the room count and the desired **'{{{automationLevel}}}'**, create a list of required smart home devices.
    *   **'Essential'**: Focus on smart lighting (1-2 bulbs per major room) and a central hub.
    *   **'Advanced'**: Include smart lighting, smart thermostats, smart locks for main doors, and a few smart speakers.
    *   **'Luxury'**: Include comprehensive smart lighting, smart thermostats, smart locks, smart speakers in multiple rooms, smart curtains/blinds for major windows, and a home theater setup for the living room.
3.  **Estimate Costs:** Use the following unit costs (in OMR). These costs are for materials/devices only.
    *   Smart LED Bulb: 12
    *   Smart Switch: 18
    *   Smart Thermostat: 60
    *   Smart Lock: 90
    *   Smart Speaker: 25
    *   Smart Curtains Motor: 150
    *   Smart Hub (e.g., Google Home/Amazon Echo): 40
    *   Home Theater System (Basic): 400
4.  **Calculate Totals:**
    *   For each item, calculate the \`totalCost\`.
    *   Sum up all total costs to get the \`totalMaterialCost\`.
    *   Estimate the \`estimatedInstallationCost\` as 25% of the \`totalMaterialCost\`.
    *   Calculate the \`grandTotal\`.
5.  **Provide Recommendations:** Give 2-3 important recommendations for a successful smart home installation (e.g., "Ensure a strong central Wi-Fi signal," "Plan for future expansion by using a scalable hub.").

Return the complete response in the specified structured JSON format.`,
});

const smartHomeEstimatorFlow = ai.defineFlow(
  {
    name: 'smartHomeEstimatorFlow',
    inputSchema: SmartHomeEstimatorInputSchema,
    outputSchema: SmartHomeEstimatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid estimation.");
    }
    return output;
  }
);

