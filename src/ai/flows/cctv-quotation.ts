
'use server';

/**
 * @fileOverview An AI agent that generates a quotation for ICT rentals and surveillance systems.
 * - generateIctProposal - a function that analyzes user requirements for a project.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initialAssets } from '@/lib/assets';
import {
    IctProposalInput,
    IctProposalInputSchema,
    IctProposalOutput,
    IctProposalOutputSchema,
} from './cctv-quotation.schema';

export async function generateIctProposal(input: IctProposalInput): Promise<IctProposalOutput> {
  return IctProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ictProposalPrompt',
  input: { schema: IctProposalInputSchema.extend({ availableAssetsJson: z.string() }) },
  output: { schema: IctProposalOutputSchema },
  prompt: `You are an expert IT and Security Solutions Architect. Your task is to analyze a client's project requirements and generate a highly professional and comprehensive ICT proposal. You must provide options for both **renting** and **purchasing** the required IT assets if applicable.

**Available IT Asset Inventory (for Rent or Purchase):**
You MUST only recommend assets from this list for the IT hardware portion.
'''json
{{{json availableAssetsJson}}}
'''

**Client Project Requirements:**
- **Project Name:** {{{projectName}}}
{{#if purpose}}
- **Purpose of Surveillance:** {{{purpose}}}
{{/if}}
{{#if projectType}}
- **Project Type:** {{{projectType}}}
{{/if}}
{{#if numberOfUsers}}
- **Number of Users:** {{{numberOfUsers}}}
{{/if}}
{{#if projectDurationMonths}}
- **Project Duration:** {{{projectDurationMonths}}} months
{{/if}}
{{#if primaryGoal}}
- **Primary Goal/Task:** {{{primaryGoal}}}
{{/if}}
- **Include Surveillance System:** {{#if includeSurveillance}}Yes{{else}}No{{/if}}
{{#if surveillanceDetails}}
- **Surveillance Details:** {{{surveillanceDetails}}}
{{/if}}
{{#if coverageType}}
- **Coverage Type:** {{{coverageType}}}
{{/if}}
- **Remote Viewing:** {{#if remoteViewing}}Yes{{else}}No{{/if}}
- **Audio Recording:** {{#if audioRecording}}Yes{{else}}No{{/if}}

**Your Task:**
1.  **Analyze and Design:**
    *   **IT Assets (If Applicable):** If the project type is NOT 'Surveillance System Only', select appropriate assets from the inventory. The quantity for user-specific items should match the **Number of Users**.
    *   **Software Recommendations (If Applicable):** Recommend essential software if IT assets are included.
    *   **Surveillance System (if includeSurveillance is true):**
        *   Design a basic but effective CCTV system suitable for the **Purpose of Surveillance** and **Surveillance Details**.
        *   If 'coverageType' is 'Exterior', recommend 'Bullet Cameras'. If 'Interior', recommend 'Dome Cameras'. If not specified, use a mix.
        *   If 'audioRecording' is true, specify that the cameras should have built-in microphones.
        *   If 'remoteViewing' is true, ensure the NVR selected is a "Network Video Recorder" capable of IP access.
        *   This system is ALWAYS a **purchase** item.

2.  **Generate Proposal Content:**
    *   **proposalId:** Create a unique ID, e.g., 'QT-SEC-12345'.
    *   **proposalTitle:** Create a clear title, e.g., "Surveillance System Proposal for {{{projectName}}}".
    *   **executiveSummary:** Write a professional paragraph explaining the proposed solution, highlighting its benefits.
    *   **rentedAssets:** Create a JSON array of any IT assets selected for rental. Include quantity.
    *   **purchasedAssets:** Create a JSON array of the SAME IT assets, formatted for purchase. Include quantity.
    *   **recommendedSoftware:** Create a JSON array of recommended software.
    *   **surveillanceSystem:**
        *   Create an equipment list for the CCTV system to be **purchased**. Use the price list below.
        *   **CCTV Price List (OMR):** 4K Dome Camera: 45, 4K Bullet Camera: 55, 8-Channel NVR: 120, 16-Channel NVR: 200, 8-Port PoE Switch: 60, 16-Port PoE Switch: 100.
        *   Write a brief summary of the surveillance solution.

3.  **Calculate Costs:**
    *   **totalRentalCostPerMonth:** Sum up (\`asset.monthlyPrice * quantity\`) for all items in \`rentedAssets\`.
    *   **totalRentalCostForDuration:** Calculate \`totalRentalCostPerMonth * (projectDurationMonths || 1)\`.
    *   **totalPurchaseCost:** Sum up (\`asset.purchasePrice * quantity\`) for all items in \`purchasedAssets\`, PLUS the total cost of the surveillance system equipment.
    *   **softwareCost:** Sum up the total cost for all items in \`recommendedSoftware\`.
    *   **grandTotalForRentalOption:** Calculate \`totalRentalCostForDuration + (response.surveillanceSystem.equipmentList.reduce((acc, item) => acc + item.totalPrice, 0)) + softwareCost\`.
    *   **grandTotalForPurchaseOption:** Calculate \`totalPurchaseCost + softwareCost\`. Note: The surveillance system is already included in totalPurchaseCost.

4.  **Next Steps:** Provide a brief, professional closing statement.

Return the complete response in the specified structured JSON format.
`,
});

const IctProposalFlow = ai.defineFlow(
  {
    name: 'IctProposalFlow',
    inputSchema: IctProposalInputSchema,
    outputSchema: IctProposalOutputSchema,
  },
  async (input) => {
    // Filter for available assets to provide to the model
    const availableAssets = initialAssets.filter(asset => asset.status === 'Available');
    const availableAssetsJson = JSON.stringify(availableAssets, null, 2);

    const { output } = await prompt({
        ...input,
        availableAssetsJson
    });
    
    if (!output) {
      throw new Error("The AI model failed to return a valid proposal.");
    }
    
    // Recalculate totals to ensure accuracy, as LLMs can make math errors.
    const rentalCostPerMonth = output.rentedAssets?.reduce((sum, item) => sum + (item.monthlyPrice * item.quantity), 0) || 0;
    const rentalCostForDuration = rentalCostPerMonth * (input.projectDurationMonths || 1);
    const itPurchaseCost = output.purchasedAssets?.reduce((sum, item) => sum + ((item.purchasePrice || 0) * item.quantity), 0) || 0;
    const surveillancePurchaseCost = output.surveillanceSystem?.equipmentList.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    const softwareCost = output.recommendedSoftware?.reduce((sum, item) => sum + item.estimatedCost, 0) || 0;
    
    output.costBreakdown.totalRentalCostPerMonth = rentalCostPerMonth;
    output.costBreakdown.totalRentalCostForDuration = rentalCostForDuration;
    output.costBreakdown.totalPurchaseCost = itPurchaseCost + surveillancePurchaseCost;
    output.costBreakdown.softwareCost = softwareCost;
    output.costBreakdown.grandTotalForRentalOption = rentalCostForDuration + surveillancePurchaseCost + softwareCost;
    output.costBreakdown.grandTotalForPurchaseOption = itPurchaseCost + surveillancePurchaseCost + softwareCost;


    return output;
  }
);
