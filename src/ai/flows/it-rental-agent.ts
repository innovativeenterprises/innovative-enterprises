
'use server';

/**
 * @fileOverview An AI agent that acts as a solutions architect for IT infrastructure rentals.
 */

import { ai } from '@/ai/genkit';
import { initialAssets } from '@/lib/assets';
import {
    ItRentalInquiryInput,
    ItRentalInquiryInputSchema,
    ItRentalProposalOutput,
    ItRentalProposalOutputSchema,
} from './it-rental-agent.schema';

export async function generateItRentalProposal(input: ItRentalInquiryInput): Promise<ItRentalProposalOutput> {
  return itRentalProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'itRentalProposalPrompt',
  input: { schema: ItRentalInquiryInputSchema },
  output: { schema: ItRentalProposalOutputSchema },
  prompt: `You are an expert IT Solutions Architect for "InfraRent". Your task is to analyze a client's requirements and create a tailored infrastructure rental proposal.

**Available Asset Inventory:**
Below is a JSON list of currently available assets. You MUST only recommend assets from this list.
\`\`\`json
{{{availableAssetsJson}}}
\`\`\`

**Client Requirements:**
- **Project Name:** {{{projectName}}}
- **Purpose of Rental:** {{{purposeOfRental}}}
- **Number of Attendees/Users:** {{{numberOfAttendees}}}
- **Existing Infrastructure:** {{#if existingInfrastructure}}{{{existingInfrastructure}}}{{else}}None specified{{/if}}
- **Client-Identified Missing Components:** {{#if missingComponents}}{{{missingComponents}}}{{else}}None specified{{/if}}
- **Rental Duration:** {{{rentalDurationMonths}}} months
- **Monthly Budget:** {{#if budget}}OMR {{{budget}}}{{else}}Not specified{{/if}}

**Your Task:**
1.  **Analyze and Design:**
    *   Carefully analyze the client's needs based on the **purpose of the rental** and the **number of attendees**. For example, a 'Training Program' for 20 people needs 20 laptops, a powerful router, and maybe a server. A 'Conference' might need laptops for registration staff, networking gear, and projectors.
    *   Consider the client's stated **existing infrastructure** and **missing components** to avoid recommending items they already have.
    *   Design a complete, logical, and cost-effective solution. Select the most appropriate assets from the inventory.
    *   For each recommended asset, you MUST determine a **quantity**. For user-specific items like laptops or workstations, the quantity should generally match the number of attendees. For shared items like servers or routers, the quantity is usually 1, unless more are clearly needed for redundancy or load.

2.  **Generate Proposal:**
    *   **proposalTitle:** Create a clear title for the proposal.
    *   **executiveSummary:** Write a concise summary explaining why the selected package is a good fit for the client's project.
    *   **recommendedAssets:** Create a JSON array of the exact asset objects you selected from the inventory. **Crucially, add a 'quantity' field to each asset object in the array.**
    *   **totalMonthlyCost:** Calculate the total cost by summing up (asset.monthlyPrice * quantity) for every asset in your recommended list.
    *   **serviceAgreement:** Draft a standard Service Level Agreement (SLA) in Markdown format. It should include sections for: Scope of Services, Rental Term, Payment Terms, Support & Maintenance (e.g., "8/5 remote support"), and Client Responsibilities.

Return the complete response in the specified structured JSON format.
`,
});

const itRentalProposalFlow = ai.defineFlow(
  {
    name: 'itRentalProposalFlow',
    inputSchema: ItRentalInquiryInputSchema,
    outputSchema: ItRentalProposalOutputSchema,
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
