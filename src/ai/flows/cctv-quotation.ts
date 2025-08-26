
'use server';

/**
 * @fileOverview An AI agent that generates a quotation for a CCTV surveillance system.
 * - generateCctvQuotation - A function that analyzes user requirements and a floor plan.
 */

import { ai } from '@/ai/genkit';
import {
    CctvQuotationInput,
    CctvQuotationInputSchema,
    CctvQuotationOutput,
    CctvQuotationOutputSchema,
} from './cctv-quotation.schema';

export async function generateCctvQuotation(input: CctvQuotationInput): Promise<CctvQuotationOutput> {
  return cctvQuotationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cctvQuotationPrompt',
  input: { schema: CctvQuotationInputSchema },
  output: { schema: CctvQuotationOutputSchema },
  prompt: `You are an expert CCTV and surveillance systems engineer. Your task is to analyze a client's requirements and generate a detailed, professional quotation for a complete installation.

**Client Requirements:**
- **Building Type:** {{buildingType}}
- **Purpose of Installation:** {{purpose}}
- **Coverage Required:** {{coverage}}
{{#if coverageDetails}}
- **Partial Coverage Details:** {{coverageDetails}}
{{/if}}
- **Remote Monitoring:** {{remoteMonitoring}}
- **Existing System:** {{existingSystem}}
- **DVR/Switch/TV Location:** {{dvrSwitchTvLocation}}

**Client Provided Assets:**
{{#if floorPlanUri}}
- **Floor Plan:** {{media url=floorPlanUri}}
{{else}}
- **Dimensions:** {{dimensions}}
{{/if}}

**Your Task:**
1.  **Analyze the Inputs:** Carefully review all the client's requirements and the provided floor plan or dimensions.
2.  **Design the System:**
    *   Determine the optimal number and type of cameras (e.g., dome, bullet, PTZ) needed to achieve the desired coverage. Consider indoor vs. outdoor placement.
    *   Select an appropriate Network Video Recorder (NVR) with sufficient channels and storage capacity. Assume standard 30-day storage unless otherwise specified.
    *   Determine the required network switch (PoE or standard) and other necessary components (e.g., power supplies, connectors).
3.  **Estimate Cabling:**
    *   Based on the floor plan/dimensions and the DVR location, estimate the total length of Ethernet cabling required.
    *   Provide brief notes on the recommended cabling strategy (e.g., "Cabling to be run through ceiling conduits").
4.  **Estimate Installation Labor:**
    *   Estimate the total labor hours required for installation, configuration, and testing.
    *   Calculate the labor cost. Assume a rate of OMR 10 per hour.
5.  **Generate Equipment List:** Create a detailed list of all equipment with quantities and estimated unit prices in OMR.
    *   4K Dome Camera: OMR 45
    *   4K Bullet Camera: OMR 55
    *   8-Channel NVR (2TB): OMR 120
    *   16-Channel NVR (4TB): OMR 200
    *   8-Port PoE Switch: OMR 60
    *   16-Port PoE Switch: OMR 100
    *   CAT6 Cable: OMR 0.3 per meter
    *   Connectors/Mounts/Misc: OMR 5 per camera
6.  **Calculate Total Cost:** Sum up the costs of all equipment and labor to provide a grand total.
7.  **Provide Summary & Next Steps:**
    *   Write a brief summary of the proposed solution.
    *   Generate a unique quotation ID.
    *   Outline the next steps for the client (e.g., "Review the quotation. To proceed, you can approve this quote to have it posted as a work order for our network of certified installers.").

Return the complete response in the specified structured JSON format.
`,
});

const cctvQuotationFlow = ai.defineFlow(
  {
    name: 'cctvQuotationFlow',
    inputSchema: CctvQuotationInputSchema,
    outputSchema: CctvQuotationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
