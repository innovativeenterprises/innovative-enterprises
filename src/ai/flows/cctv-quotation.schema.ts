
/**
 * @fileOverview Schemas and types for the ICT & Surveillance Proposal AI flow.
 */

import { z } from 'zod';
import { AssetSchema } from '@/lib/assets.schema';

export const IctProposalInputSchema = z.object({
  projectName: z.string().describe("The name of the client's project or event."),
  projectType: z.enum([
    'Temporary Office Setup',
    'Training Program or Workshop',
    'Special Event (e.g., conference, hackathon)',
    'Short-term Project (e.g., data analysis, software dev)',
    'Hardware Evaluation or Testing',
    'Other'
  ]).describe("The type of project the client is undertaking."),
  numberOfUsers: z.coerce.number().describe("The number of people who will need equipment (attendees, staff, etc.)."),
  projectDurationMonths: z.coerce.number().describe("The duration of the project in months."),
  primaryGoal: z.string().describe("A description of what the users will be doing, which informs the type of hardware needed."),
  includeSurveillance: z.boolean().describe("Whether the client also needs a quote for a surveillance system."),
  surveillanceDetails: z.string().optional().describe("Specific requirements for the surveillance system, if requested."),
});
export type IctProposalInput = z.infer<typeof IctProposalInputSchema>;

const EquipmentSchema = z.object({
  item: z.string().describe("The name of the equipment (e.g., '4K Dome Camera', '16-Channel NVR')."),
  quantity: z.number().describe("The quantity of this item."),
  unitPrice: z.number().describe("The estimated price per unit in OMR."),
  totalPrice: z.number().describe("The total estimated price for this line item (quantity * unitPrice)."),
});

export const IctProposalOutputSchema = z.object({
  proposalId: z.string().describe("A unique ID for this proposal (e.g., 'QT-ICT-12345')."),
  proposalTitle: z.string().describe("A clear and descriptive title for the proposal."),
  executiveSummary: z.string().describe("A single, concise paragraph summarizing the proposed technology solution."),
  recommendedAssets: z.array(AssetSchema.extend({ quantity: z.number().describe("The number of units recommended for this asset.") })).describe("A list of recommended IT assets for rental from the available inventory, including quantity."),
  surveillanceSystem: z.object({
    summary: z.string().optional().describe("A brief summary of the proposed surveillance solution."),
    equipmentList: z.array(EquipmentSchema).describe("A detailed list of all required equipment for the surveillance system purchase."),
  }).describe("Details of the surveillance system to be purchased."),
  totalEstimatedCost: z.number().describe("The grand total estimated cost for the project. This should be the sum of all one-time purchase costs (like CCTV) and the total rental cost over the project duration."),
  costBreakdown: z.object({
    totalRentalCostPerMonth: z.number().describe("The total monthly cost for all rented assets."),
    totalRentalCostForDuration: z.number().describe("The total rental cost over the entire project duration."),
    oneTimePurchaseCost: z.number().describe("The total cost for all purchased items (e.g., surveillance system)."),
  }),
  nextSteps: z.string().describe("Recommended next steps for the user to take after reviewing the proposal."),
});
export type IctProposalOutput = z.infer<typeof IctProposalOutputSchema>;
