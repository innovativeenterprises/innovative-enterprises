
/**
 * @fileOverview Schemas and types for the Real Estate Contract Generator AI flow.
 */
import { z } from 'zod';

export const RealEstateContractInputSchema = z.object({
  contractType: z.enum(['Tenancy Agreement', 'Sale Agreement']),
  lessorName: z.string().optional().describe("The name of the Landlord/Lessor/Seller."),
  lesseeName: z.string().optional().describe("The name of the Tenant/Lessee/Buyer."),
  propertyAddress: z.string().min(5, "A full property address is required."),
  propertyType: z.string().min(3, "Please specify the property type (e.g., '2-bedroom apartment', 'commercial office')."),
  price: z.coerce.number().positive("Price/Rent must be a positive number."),
  pricePeriod: z.string().optional().describe("For rentals, the period (e.g., 'per month', 'per year')."),
  startDate: z.string().optional().describe("The start date of the agreement (YYYY-MM-DD)."),
  endDate: z.string().optional().describe("The end date of the agreement (YYYY-MM-DD)."),
  additionalClauses: z.string().optional().describe("Any additional custom clauses to include."),
});
export type RealEstateContractInput = z.infer<typeof RealEstateContractInputSchema>;

export const RealEstateContractOutputSchema = z.object({
  contractContent: z.string().describe("The full, formatted content of the generated real estate contract in Markdown."),
});
export type RealEstateContractOutput = z.infer<typeof RealEstateContractOutputSchema>;
