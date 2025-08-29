
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
  input: { schema: IctProposalInputSchema },
  output: { schema: IctProposalOutputSchema },
  prompt: `You are an expert IT and Security Solutions Architect. Your task is to analyze a client's project requirements and generate a highly professional and comprehensive ICT proposal, recommending rental equipment, necessary software, and designing a surveillance system if needed.

**Available IT Rental Asset Inventory:**
You MUST only recommend assets from this list for the rental portion.
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
    *   **IT Rentals:** Based on the **Project Type** and **Primary Goal**, select the most appropriate rental assets from the **Available Asset Inventory**.
        *   For a 'Training Program', you might need {{numberOfUsers}} laptops.
        *   For a 'Special Event', you might need laptops, networking gear, and projectors.
        *   For 'Data Analysis', you'd need powerful workstations or servers.
        *   The **quantity** for user-specific items (laptops, workstations) should match the **Number of Users**. For shared items (servers, routers), the quantity is usually 1.
    *   **Software Recommendations:** Based on the project type and goal, recommend essential software. For example, a 'Temporary Office Setup' needs 'Windows 11 Pro' and 'Microsoft 365 Business'. A 'Software Dev' project might need 'JetBrains IDE Suite' or 'VS Code'. Assume standard one-time or subscription costs (e.g., M365 is ~OMR 8/user/month).
    *   **Surveillance System (if includeSurveillance is true):**
        *   Design a basic but effective CCTV system suitable for the **Project Type**.
        *   Determine the number and type of cameras (Dome, Bullet). A typical office might need 4-8 cameras. An event might need more.
        *   Select an appropriate Network Video Recorder (NVR) and network switch.
        *   If **Surveillance Details** are provided, use them to tailor the system. Otherwise, make reasonable assumptions.

2.  **Generate Proposal Content:**
    *   **proposalId:** Create a unique ID, e.g., 'QT-ICT-12345'.
    *   **proposalTitle:** Create a clear title, e.g., "ICT & Surveillance Proposal for {{{projectName}}}".
    *   **executiveSummary:** Write a highly professional and concise paragraph explaining the proposed solution. It should sound like it was written by a senior solutions architect, highlighting how the recommended hardware and software package will effectively meet the client's stated goals and ensure a smooth, productive project execution.
    *   **recommendedAssets:** Create a JSON array of the exact rental asset objects you selected from the inventory. Crucially, add a 'quantity' field to each asset object. If no rental assets are needed, return an empty array.
    *   **recommendedSoftware:** Create a JSON array of recommended software, including name, purpose, and estimated cost.
    *   **surveillanceSystem:**
        *   Create an equipment list for the CCTV system to be **purchased**. Use the price list below. If \`includeSurveillance\` is false, this list should be empty.
        *   **CCTV Price List (OMR):** 4K Dome Camera: 45, 4K Bullet Camera: 55, 8-Channel NVR: 120, 16-Channel NVR: 200, 8-Port PoE Switch: 60, 16-Port PoE Switch: 100.
        *   Write a brief summary of the surveillance solution.

3.  **Calculate Costs:**
    *   **totalRentalCostPerMonth:** Sum up (asset.monthlyPrice * quantity) for all items in \`recommendedAssets\`.
    *   **totalRentalCostForDuration:** Calculate \`totalRentalCostPerMonth * projectDurationMonths\`.
    *   **oneTimePurchaseCost:** Sum up the total price for all items in the \`surveillanceSystem.equipmentList\`.
    *   **softwareCost:** Sum up the total cost for all items in \`recommendedSoftware\`.
    *   **totalEstimatedCost:** Calculate \`totalRentalCostForDuration + oneTimePurchaseCost + softwareCost\`.

4.  **Next Steps:** Provide a brief, professional closing statement recommending the next steps for the client.

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
