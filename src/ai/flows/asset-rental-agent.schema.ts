/**
 * @fileOverview Schemas and types for the Asset Rental Agent flow.
 */

import { z } from 'zod';
import { AssetSchema } from '@/lib/assets.schema'; // We'll create this to share the asset shape

export const AssetRentalInquiryInputSchema = z.object({
  projectName: z.string().min(3, "Project name is required."),
  purposeOfRental: z.enum([
    'Construction Project',
    'Temporary Office Setup',
    'Training Program or Workshop',
    'Special Event',
    'Short-term Project',
    'Other'
  ]),
  numberOfWorkers: z.coerce.number().min(1, "Please specify the number of workers/users."),
  existingInfrastructure: z.string().optional().describe("List any equipment you already have (e.g., 'We have safety gear and power generators')."),
  missingComponents: z.string().optional().describe("Tell us what specific components you know you're missing."),
  rentalDurationMonths: z.coerce.number().min(1, "Minimum rental is 1 month."),
  budget: z.coerce.number().optional().describe("Your estimated monthly budget in OMR."),
});
export type AssetRentalInquiryInput = z.infer<typeof AssetRentalInquiryInputSchema>;


export const AssetRentalProposalOutputSchema = z.object({
  proposalTitle: z.string().describe("A title for the proposal, e.g., 'Infrastructure Proposal for Project X'."),
  executiveSummary: z.string().describe("A brief summary of the proposed solution and its benefits."),
  recommendedAssets: z.array(AssetSchema.extend({ quantity: z.number().describe("The number of units recommended for this asset.") })).describe("A list of recommended assets from the available inventory, including quantity."),
  totalMonthlyCost: z.number().describe("The total calculated monthly cost for all recommended assets."),
  serviceAgreement: z.string().describe("A generated service level agreement (SLA) in Markdown format, outlining terms, support, and responsibilities."),
});
export type AssetRentalProposalOutput = z.infer<typeof AssetRentalProposalOutputSchema>;
