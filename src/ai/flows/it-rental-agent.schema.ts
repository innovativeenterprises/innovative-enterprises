
/**
 * @fileOverview Schemas and types for the IT Infrastructure Rental Agent flow.
 */

import { z } from 'zod';
import { AssetSchema as ExternalAssetSchema } from '@/lib/assets.schema';

export const AssetSchema = ExternalAssetSchema;
export type Asset = z.infer<typeof AssetSchema>;


export const ItRentalInquiryInputSchema = z.object({
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
  existingInfrastructure: z.string().optional().describe("List any equipment you already have (e.g., 'We have monitors and mice')."),
  missingComponents: z.string().optional().describe("Tell us what specific components you know you're missing."),
  rentalDurationMonths: z.coerce.number().min(1, "Minimum rental is 1 month."),
  budget: z.coerce.number().optional().describe("Your estimated monthly budget in OMR."),
});
export type ItRentalInquiryInput = z.infer<typeof ItRentalInquiryInputSchema>;


export const ItRentalProposalOutputSchema = z.object({
  proposalTitle: z.string().describe("A title for the proposal, e.g., 'Infrastructure Proposal for Project X'."),
  executiveSummary: z.string().describe("A brief summary of the proposed solution and its benefits."),
  recommendedAssets: z.array(AssetSchema.extend({ quantity: z.number().describe("The number of units recommended for this asset.") })).describe("A list of recommended assets from the available inventory, including quantity."),
  totalMonthlyCost: z.number().describe("The total calculated monthly cost for all recommended assets."),
  serviceAgreement: z.string().describe("A generated service level agreement (SLA) in Markdown format, outlining terms, support, and responsibilities."),
});
export type ItRentalProposalOutput = z.infer<typeof ItRentalProposalOutputSchema>;
