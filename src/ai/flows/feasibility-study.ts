
'use server';

/**
 * @fileOverview An AI agent that generates a feasibility study for a business idea
 * by using other AI agents for research.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { FeasibilityStudyInputSchema, FeasibilityStudyOutputSchema, type FeasibilityStudyInput, type FeasibilityStudyOutput } from './feasibility-study.schema';
import { scrapeAndSummarize } from './web-scraper-agent';

export async function generateFeasibilityStudy(input: FeasibilityStudyInput): Promise<FeasibilityStudyOutput> {
  return feasibilityStudyFlow(input);
}


const synthesizerPrompt = ai.definePrompt({
    name: 'feasibilityStudySynthesizer',
    input: { schema: z.object({
        businessIdea: z.string(),
        marketAnalysisReport: z.string(),
        competitorReport: z.string(),
        targetAudienceReport: z.string(),
    })},
    output: { schema: FeasibilityStudyOutputSchema },
    prompt: `You are "Sage," an expert business strategist and analyst. Your task is to synthesize research from various sources into a single, cohesive, and professional feasibility study.

**Original Business Idea:**
{{{businessIdea}}}

**Internal Research Reports:**

1.  **Market Analysis Report:**
    """
    {{{marketAnalysisReport}}}
    """

2.  **Competitive Landscape Report:**
    """
    {{{competitorReport}}}
    """
    
3.  **Target Audience Report:**
    """
    {{{targetAudienceReport}}}
    """

**Your Task:**
Based *only* on the information provided in the internal research reports above, create a comprehensive feasibility study.

1.  **Title:** Create a professional title, e.g., "Feasibility Study for a '{{{businessIdea}}}'".
2.  **Executive Summary:** Write a high-level summary paragraph that encapsulates the key findings from all reports.
3.  **Market Analysis:** Summarize the market analysis report, including its key findings.
4.  **Competitive Landscape:** Summarize the competitor report. Identify the main competitors and list their strengths and weaknesses as described in the report.
5.  **Target Audience:** Summarize the target audience report, detailing the ideal customer profile and their key characteristics.
6.  **Recommendation:**
    *   Provide a final conclusion on the business idea's viability.
    *   Give a confidence score (0-100) based on the opportunities and challenges identified in the reports.

Return the complete study in the specified structured JSON format. Do not invent information not present in the provided reports.
`,
})


const feasibilityStudyFlow = ai.defineFlow(
  {
    name: 'feasibilityStudyFlow',
    inputSchema: FeasibilityStudyInputSchema,
    outputSchema: FeasibilityStudyOutputSchema,
  },
  async ({ businessIdea }) => {
    
    // Step 1: Use the web scraper agent (Rami) to conduct targeted research.
    const [marketAnalysis, competitorAnalysis, targetAudienceAnalysis] = await Promise.all([
        scrapeAndSummarize({ source: `Market analysis for ${businessIdea}`, isUrl: false }),
        scrapeAndSummarize({ source: `Major competitors for ${businessIdea}`, isUrl: false }),
        scrapeAndSummarize({ source: `Target audience profile for ${businessIdea}`, isUrl: false }),
    ]);

    // Step 2: Use the synthesizer agent (Sage) to compile the research into a study.
    const llmResponse = await ai.generate({
        prompt: synthesizerPrompt,
        input: {
            businessIdea,
            marketAnalysisReport: marketAnalysis.summary,
            competitorReport: competitorAnalysis.summary,
            targetAudienceReport: targetAudienceAnalysis.summary,
        },
        model: 'googleai/gemini-2.0-flash',
        output: {
            format: 'json',
            schema: FeasibilityStudyOutputSchema,
        }
    });
    
    return llmResponse.output()!;
  }
);
