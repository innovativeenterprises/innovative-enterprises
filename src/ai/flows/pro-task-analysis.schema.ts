

/**
 * @fileOverview Schemas and types for the PRO Task Analysis flow.
 */

import { z } from 'zod';
import { OMAN_GOVERNORATES, OMAN_MINISTRIES } from '@/lib/oman-locations';

export const ProTaskAnalysisInputSchema = z.object({
  institutionNames: z.array(z.string()).min(1, "At least one institution must be selected."),
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;


const AllowanceSchema = z.object({
    description: z.string().describe("The description of the allowance (e.g., 'Fuel Allowance', 'Snacks')."),
    amount: z.number().describe("The estimated amount in OMR."),
});


export const ProTaskAnalysisOutputSchema = z.object({
  tripDescription: z.string().describe("A short description of the planned trip."),
  allowances: z.array(AllowanceSchema).describe("A consolidated list of all allowances for the trip."),
  grandTotal: z.number().describe("The grand total estimated cost for the entire assignment."),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;
