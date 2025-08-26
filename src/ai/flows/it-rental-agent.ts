
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
Below is a JSON list of currently available assets. You MUST only recommend assets from this list. You can recommend multiple assets of the same type if needed.
\`\`\`json
{{{availableAssetsJson}}}
\`\`\`

**Client Requirements:**
- **Project Name:** {{{projectName}}}
- **Project Type:** {{{projectType}}}
- **User Count:** {{{userCount}}}
- **Expected Workload:** {{{workload}}}
- **Required Software:** {{#if requiredSoftware}}{{{requiredSoftware}}}{{else}}None specified{{/if}}
- **Storage Needs:** {{{storageNeeds}}}
- **Networking Needs:** {{{networkNeeds}}}
- **Security Needs:** {{#if securityNeeds}}{{{securityNeeds}}}{{else}}Standard security measures{{/if}}
- **Monthly Budget:** {{#if budget}}OMR {{{budget}}}{{else}}Not specified{{/if}}
- **Rental Duration:** {{{rentalDurationMonths}}} months

**Your Task:**
1.  **Analyze and Select:** Carefully analyze the client's needs. Select the most appropriate assets from the inventory to build a complete and cost-effective solution. Pay attention to the number of users, workload, and software requirements to determine the necessary specifications (RAM, CPU, etc.).
2.  **Calculate Cost:** Sum the 'monthlyPrice' of all selected assets to calculate the 'totalMonthlyCost'.
3.  **Write Proposal:**
    *   **proposalTitle:** Create a clear title for the proposal.
    *   **executiveSummary:** Write a concise summary explaining why the selected package is a good fit for the client's project.
    *   **recommendedAssets:** Create a JSON array of the exact asset objects you selected from the inventory.
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
