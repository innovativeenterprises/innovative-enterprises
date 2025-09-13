
'use server';

import { z } from 'zod';
import { ProductSchema } from '@/lib/products.schema';
import { ProviderSchema } from '@/lib/providers.schema';
import { KpiDataSchema } from '@/lib/cfo-data.schema';

export const CooAnalysisInputSchema = z.object({
  products: z.array(ProductSchema).describe("List of all company products/projects."),
  providers: z.array(ProviderSchema).describe("List of all service providers in the network."),
  kpiData: z.array(KpiDataSchema).describe("Key Performance Indicator data from the CFO dashboard."),
});
export type CooAnalysisInput = z.infer<typeof CooAnalysisInputSchema>;

const RiskSchema = z.object({
    source: z.string().describe("The name of the project or area the risk is related to."),
    risk: z.string().describe("A concise description of the identified risk."),
    recommendation: z.string().describe("A specific, actionable recommendation to mitigate the risk."),
    severity: z.enum(['High', 'Medium', 'Low']).describe("The assessed severity of the risk."),
});

export const CooAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe("A brief, high-level overview of the entire business operation's health."),
  identifiedRisks: z.array(RiskSchema).describe("A list of the most critical risks identified from the data."),
  strategicOpportunities: z.array(z.string()).describe("A list of potential strategic opportunities or positive trends worth noting."),
});
export type CooAnalysisOutput = z.infer<typeof CooAnalysisOutputSchema>;
