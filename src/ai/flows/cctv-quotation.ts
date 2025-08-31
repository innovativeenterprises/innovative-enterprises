
'use server';

/**
 * @fileOverview An AI agent that generates a quotation for ICT rentals and surveillance systems.
 * - generateIctProposal - a function that analyzes user requirements for a project.
 */

import { ai } from '@/ai/genkit';
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
  prompt: `You are an expert IT and Security Solutions Architect. Your task is to analyze a client's project requirements and generate a highly professional and comprehensive ICT proposal. You must provide options for both **renting** and **purchasing** the required IT assets.

**Available IT Asset Inventory (for Rent or Purchase):**
You MUST only recommend assets from this list for the IT hardware portion.
'''json
{{{availableAssetsJson}}}
'''

**Client Project Requirements:**
- **Project Name:** {{{projectName}}}
- **Project Type:** {{{projectType}}}
- **Number of Users:** {{{numberOfUsers}}}
- **Project Duration:** {{{projectDurationMonths}}} months
- **Primary Goal/Task:** {{{primaryGoal}}}
- **Include Surveillance System:** {{#if includeSurveillance}}Yes{{else}}No{{/if}}
{{#if surveillanceDetails}}
- **Surveillance Details:** {{{surveillanceDetails}}}
{{/if}}

**Your Task:**
1.  **Analyze and Design:**
    *   **IT Assets:** Based on the **Project Type** and **Primary Goal**, select the most appropriate assets from the **Available Asset Inventory**.
        *   The **quantity** for user-specific items (laptops, workstations) should match the **Number of Users**. For shared items (servers, routers), the quantity is usually 1.
    *   **Software Recommendations:** Based on the project type and goal, recommend essential software (e.g., 'Windows 11 Pro', 'Microsoft 365 Business').
    *   **Surveillance System (if includeSurveillance is true):**
        *   Design a basic but effective CCTV system suitable for the **Project Type**.
        *   Determine the number and type of cameras (Dome, Bullet), NVR, and switch. If **Surveillance Details** are provided, use them.
        *   This system is ALWAYS a **purchase** item.

2.  **Generate Proposal Content:**
    *   **proposalId:** Create a unique ID, e.g., 'QT-ICT-12345'.
    *   **proposalTitle:** Create a clear title, e.g., "ICT & Surveillance Proposal for {{{projectName}}}".
    *   **executiveSummary:** Write a professional paragraph explaining the proposed solution, highlighting its benefits.
    *   **rentedAssets:** Create a JSON array of the IT assets you selected, formatted for the rental option. Include quantity.
    *   **purchasedAssets:** Create a JSON array of the SAME IT assets, formatted for the purchase option. Include quantity.
    *   **recommendedSoftware:** Create a JSON array of recommended software.
    *   **surveillanceSystem:**
        *   Create an equipment list for the CCTV system to be **purchased**. Use the price list below.
        *   **CCTV Price List (OMR):** 4K Dome Camera: 4.5, 4K Bullet Camera: 5.5, 8-Channel NVR: 12.0, 16-Channel NVR: 20.0, 8-Port PoE Switch: 6.0, 16-Port PoE Switch: 10.0.
        *   Write a brief summary of the surveillance solution.

3.  **Calculate Costs:**
    *   **totalRentalCostPerMonth:** Sum up (\`asset.monthlyPrice * quantity\`) for all items in \`rentedAssets\`.
    *   **totalRentalCostForDuration:** Calculate \`totalRentalCostPerMonth * projectDurationMonths\`.
    *   **totalPurchaseCost:** Sum up (\`asset.purchasePrice * quantity\`) for all items in \`purchasedAssets\`, PLUS the total cost of the surveillance system equipment.
    *   **softwareCost:** Sum up the total cost for all items in \`recommendedSoftware\`.
    *   **grandTotalForRentalOption:** Calculate \`totalRentalCostForDuration + surveillanceSystemCost + softwareCost\`.
    *   **grandTotalForPurchaseOption:** Calculate \`totalPurchaseCost (IT assets) + surveillanceSystemCost + softwareCost\`.

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
    
    return output!;
  }
);
