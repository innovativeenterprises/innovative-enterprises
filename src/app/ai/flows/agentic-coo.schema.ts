

import { z } from 'zod';
import { KpiDataSchema } from '@/lib/cfo-data.schema';
import { ProductSchema } from '@/lib/products.schema';
import { ProviderSchema } from '@/lib/providers.schema';

export const CooAnalysisInputSchema = z.object({
  products: z.array(ProductSchema),
  providers: z.array(ProviderSchema),
  kpiData: z.array(KpiDataSchema),
});
export type CooAnalysisInput = z.infer<typeof CooAnalysisInputSchema>;

export const CooAnalysisOutputSchema = z.object({
  executiveSummary: z.string(),
  identifiedRisks: z.array(z.object({
    source: z.string().describe("The source or area of the risk, e.g., 'Project', 'Network', 'Financial'."),
    risk: z.string().describe("A clear and concise description of the identified risk."),
    recommendation: z.string().describe("A concrete, actionable recommendation to mitigate the risk."),
    severity: z.enum(['High', 'Medium', 'Low']).describe("The assessed severity of the risk."),
  })),
  strategicOpportunities: z.array(z.string()).describe("A list of 2-3 strategic opportunities identified from the data."),
});
export type CooAnalysisOutput = z.infer<typeof CooAnalysisOutputSchema>;
