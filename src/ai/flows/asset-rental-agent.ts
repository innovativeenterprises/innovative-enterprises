
'use server';

/**
 * @fileOverview An AI agent that acts as a solutions architect for asset rentals.
 */

import { ai } from '@/ai/genkit';
import { getAssets } from '@/lib/firestore';
import {
    AssetRentalInquiryInput,
    AssetRentalInquiryInputSchema,
    AssetRentalProposalOutput,
    AssetRentalProposalOutputSchema,
} from './asset-rental-agent.schema';

export async function generateAssetRentalProposal(input: AssetRentalInquiryInput): Promise<AssetRentalProposalOutput> {
  return assetRentalProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assetRentalProposalPrompt',
  input: { schema: AssetRentalInquiryInputSchema.extend({ availableAssetsJson: z.string() }) },
  output: { schema: AssetRentalProposalOutputSchema },
  prompt: `You are an expert Solutions Architect for "InfraRent". Your task is to analyze a client's requirements and create a tailored infrastructure rental proposal.

**Available Asset Inventory:**
Below is a JSON list of currently available assets. You MUST only recommend assets from this list.
'''json
{{{availableAssetsJson}}}
'''

**Client Requirements:**
- **Project Name:** {{{projectName}}}
- **Purpose of Rental:** {{{purposeOfRental}}}
- **Number of Workers/Users:** {{{numberOfWorkers}}}
- **Existing Infrastructure:** {{#if existingInfrastructure}}{{{existingInfrastructure}}}{{else}}None specified{{/if}}
- **Client-Identified Missing Components:** {{#if missingComponents}}{{{missingComponents}}}{{else}}None specified{{/if}}
- **Rental Duration:** {{{rentalDurationMonths}}} months
- **Monthly Budget:** {{#if budget}}OMR {{{budget}}}{{else}}Not specified{{/if}}

**Your Task:**
1.  **Analyze and Design:**
    *   Carefully analyze the client's needs based on the **purpose of the rental** and the **number of workers**. For example, a 'Construction Project' for 20 workers might need heavy machinery, power tools, and a site office setup. A 'Training Program' might need laptops and networking gear.
    *   Consider the client's stated **existing infrastructure** and **missing components** to avoid recommending items they don't need.
    *   Design a complete, logical, and cost-effective solution. Select the most appropriate assets from the inventory.
    *   For each recommended asset, you MUST determine a **quantity**. For worker-specific items, the quantity should generally match the number of workers. For shared items like servers or excavators, the quantity is usually 1, unless more are clearly needed.

2.  **Generate Proposal:**
    *   **proposalTitle:** Create a clear title for the proposal.
    *   **executiveSummary:** Write a concise summary explaining why the selected package is a good fit for the client's project.
    *   **recommendedAssets:** Create a JSON array of the exact asset objects you selected from the inventory. **Crucially, add a 'quantity' field to each asset object in the array.**
    *   **totalMonthlyCost:** Calculate the total cost by summing up (asset.monthlyPrice * quantity) for every asset in your recommended list.
    *   **serviceAgreement:** Draft a standard Service Level Agreement (SLA) in Markdown format. It should include sections for: Scope of Services, Rental Term, Payment Terms, Support & Maintenance (e.g., "8/5 remote support"), and Client Responsibilities.

Return the complete response in the specified structured JSON format.
`,
});

const assetRentalProposalFlow = ai.defineFlow(
  {
    name: 'assetRentalProposalFlow',
    inputSchema: AssetRentalInquiryInputSchema,
    outputSchema: AssetRentalProposalOutputSchema,
  },
  async (input) => {
    const allAssets = await getAssets();
    // Filter for available assets to provide to the model
    const availableAssets = allAssets.filter(asset => asset.status === 'Available');
    const availableAssetsJson = JSON.stringify(availableAssets, null, 2);

    const { output } = await prompt({
        ...input,
        availableAssetsJson
    });
    
    return output!;
  }
);
