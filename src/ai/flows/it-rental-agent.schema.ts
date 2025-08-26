/**
 * @fileOverview Schemas and types for the IT Infrastructure Rental Agent flow.
 */

import { z } from 'zod';
import { AssetSchema } from '@/lib/assets.schema'; // We'll create this to share the asset shape

export const ItRentalInquiryInputSchema = z.object({
  projectName: z.string().min(3, "Project name is required."),
  projectType: z.enum([
    'Web Hosting (e.g., Website, E-commerce)',
    'Data Analytics & BI',
    'AI/ML Model Training',
    'Development & Testing Environment',
    'General Office Workstations',
    'Other'
  ]),
  userCount: z.coerce.number().min(1, "At least one user is required."),
  workload: z.enum(['Low (occasional use)', 'Medium (consistent daily use)', 'High (intensive, 24/7 processing)']),
  requiredSoftware: z.string().optional().describe("List any specific software required, e.g., 'Docker, NodeJS, Python 3.10'"),
  storageNeeds: z.string().min(3, "Please specify storage needs (e.g., '500GB SSD', '10TB HDD for backups')."),
  networkNeeds: z.string().min(3, "Describe network needs (e.g., 'High-speed internal network, 1Gbps internet')."),
  securityNeeds: z.string().optional().describe("Describe any special security needs like VPNs, firewalls, etc."),
  budget: z.coerce.number().optional().describe("Your estimated monthly budget in OMR."),
  rentalDurationMonths: z.coerce.number().min(1, "Minimum rental is 1 month."),
});
export type ItRentalInquiryInput = z.infer<typeof ItRentalInquiryInputSchema>;


export const ItRentalProposalOutputSchema = z.object({
  proposalTitle: z.string().describe("A title for the proposal, e.g., 'Infrastructure Proposal for Project X'."),
  executiveSummary: z.string().describe("A brief summary of the proposed solution and its benefits."),
  recommendedAssets: z.array(AssetSchema).describe("A list of recommended assets from the available inventory."),
  totalMonthlyCost: z.number().describe("The total calculated monthly cost for all recommended assets."),
  serviceAgreement: z.string().describe("A generated service level agreement (SLA) in Markdown format, outlining terms, support, and responsibilities."),
});
export type ItRentalProposalOutput = z.infer<typeof ItRentalProposalOutputSchema>;
