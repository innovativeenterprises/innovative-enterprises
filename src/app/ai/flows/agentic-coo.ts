
'use server';

/**
 * @fileOverview An AI agent that acts as a Chief Operating Officer (COO),
 * analyzing business data to provide strategic insights.
 */

import { ai } from '@/ai/genkit';
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


export async function analyzeOperations(input: CooAnalysisInput): Promise<CooAnalysisOutput> {
  return cooAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agenticCooPrompt',
  input: { schema: CooAnalysisInputSchema },
  output: { schema: CooAnalysisOutputSchema },
  prompt: `You are "JADE" (Juristic And Decision-making Entity), the AI Chief Operating Officer for Innovative Enterprises. Your task is to analyze a snapshot of the company's operational data and provide a strategic overview for the executive team.

**Operational Data Snapshot:**

1.  **Projects/Products:**
    '''json
    {{{json products}}}
    '''

2.  **Provider Network:**
    '''json
    {{{json providers}}}
    '''

3.  **Financial KPIs:**
    '''json
    {{{json kpiData}}}
    '''

**Your Analysis Mandate:**

1.  **Executive Summary:**
    *   Begin with a high-level, one-paragraph summary of the overall business health. Synthesize insights from projects, network status, and financial KPIs.

2.  **Risk Identification:**
    *   **Project Risks:** Scrutinize the 'products' list. Identify any projects with an 'adminStatus' of "At Risk" or "On Hold". For each, create a risk entry.
    *   **Network Risks:** Analyze the 'providers' list. A high number of providers with a 'status' of "Pending Review" or "On Hold" could be a bottleneck. Note this as a risk if applicable.
    *   **Financial Risks:** Review the 'kpiData'. Look for any KPIs showing negative trends (e.g., a decrease in revenue or profit, a significant increase in expenses).
    *   For each identified risk, provide a clear 'risk' description, a concrete 'recommendation' for the team to consider, and assess its 'severity' as High, Medium, or Low.

3.  **Strategic Opportunities:**
    *   Identify 2-3 positive trends or potential opportunities from the data. Examples might include: "The high number of 'Vetted' providers is a strength we can leverage for new service offerings," or "The 'Smart PM SaaS' project is complete; consider launching a marketing campaign to drive adoption."

Return your complete analysis in the specified structured JSON format. Be professional, concise, and data-driven in your assessment.
`,
});

const cooAnalysisFlow = ai.defineFlow(
  {
    name: 'cooAnalysisFlow',
    inputSchema: CooAnalysisInputSchema,
    outputSchema: CooAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
