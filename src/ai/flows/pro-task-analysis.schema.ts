

/**
 * @fileOverview Schemas and types for the PRO Task Analysis flow.
 */

import { z } from 'zod';
import { OMAN_MINISTRIES, OMAN_GOVERNORATES } from '@/lib/oman-locations';

export const ProTaskAnalysisInputSchema = z.object({
  serviceNames: z.array(z.string()).min(1, "At least one service name is required."),
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;


const FeeSchema = z.object({
    description: z.string().describe("The description of the fee (e.g., 'CR Renewal Fee', 'Fuel Allowance')."),
    amount: z.number().describe("The estimated amount in OMR."),
});

export const ProTaskAnalysisSchema = z.object({
  serviceName: z.string(),
  documentList: z.array(z.string()).describe("A comprehensive list of all required documents for this specific service."),
  notes: z.string().optional().describe("Any important notes or pre-requisites for the user regarding this service."),
  fees: z.array(FeeSchema).describe("A breakdown of estimated government fees for this specific task."),
  ministryToVisit: z.enum([...OMAN_MINISTRIES, "Online"]).describe("The government ministry or authority building the PRO must visit for this task. 'Online' if no physical visit is required."),
});
export type ProTaskAnalysis = z.infer<typeof ProTaskAnalysisSchema>;


export const ProTaskAnalysisOutputSchema = z.object({
  tasks: z.array(ProTaskAnalysisSchema),
  totalFees: z.array(FeeSchema).describe("A consolidated list of all fees for all tasks, including allowances."),
  grandTotal: z.number().describe("The grand total estimated cost for the entire assignment."),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;
