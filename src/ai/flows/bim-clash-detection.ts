'use server';

/**
 * @fileOverview An AI agent that simulates BIM clash detection.
 */
import { ai } from '@/ai/genkit';
import {
  BimClashDetectionInputSchema,
  type BimClashDetectionInput,
  BimClashDetectionOutputSchema,
  type BimClashDetectionOutput,
} from './bim-clash-detection.schema';

// This is a dummy prompt that simulates the analysis.
// In a real application, you would use a specialized model or a series of tools
// to parse the BIM file and perform geometric analysis.
const prompt = ai.definePrompt({
  name: 'bimClashDetectionPrompt',
  input: { schema: BimClashDetectionInputSchema },
  output: { schema: BimClashDetectionOutputSchema },
  prompt: `You are StructurAI, an expert BIM model analyst. Your task is to analyze the provided BIM model and identify potential clashes. 

For the purpose of this simulation, you don't need to actually parse the file. Instead, based on the filename "{{fileName}}", generate a realistic but fictional list of 3 to 5 clashes that might occur in a building project.

**Instructions:**
1.  **Generate Fictional Clashes:** Create a list of 3-5 clashes.
2.  **Vary Severity:** Include clashes with 'High', 'Medium', and 'Low' severity.
3.  **Be Specific:** For each clash, provide:
    *   A clear \`description\` (e.g., "HVAC duct passing through structural beam").
    *   Fictional \`elementIds\` (e.g., ["HVAC-Duct-052", "Beam-C-2-45"]).
    *   An actionable \`recommendation\` (e.g., "Reroute HVAC duct below beam or create a penetration.").
4.  **Return Data:** Populate the results into the specified JSON format, including the original \`fileName\`.

**Example High-Severity Clash:** "Main water pipe conflicts with primary electrical conduit."
**Example Medium-Severity Clash:** "Fire sprinkler head is partially obstructed by a cable tray."
**Example Low-Severity Clash:** "Light fixture placement conflicts with ceiling grid layout."
`,
});

export const detectBimClashes = ai.defineFlow(
  {
    name: 'detectBimClashesFlow',
    inputSchema: BimClashDetectionInputSchema,
    outputSchema: BimClashDetectionOutputSchema,
  },
  async (input) => {
    // In a real-world scenario, this is where you would integrate a library
    // like IFC.js or Autodesk Forge to parse the `input.modelFileUri` and
    // extract geometric data before sending it to an analysis model.
    // For this prototype, we pass the file info directly to the LLM to simulate the output.
    
    const { output } = await prompt(input);
    
    if (!output) {
        throw new Error("Failed to get a response from the clash detection model.");
    }
    
    return output;
  }
);
