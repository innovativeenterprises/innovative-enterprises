
'use server';

/**
 * @fileOverview An AI agent that analyzes a webpage for SEO best practices.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeAndSummarize } from './web-scraper-agent';
import { SeoAnalysisInputSchema, SeoAnalysisOutputSchema, type SeoAnalysisInput, type SeoAnalysisOutput } from './seo-analyzer.schema';


export async function analyzeSeo(input: SeoAnalysisInput): Promise<SeoAnalysisOutput> {
  return seoAnalyzerFlow(input);
}


const prompt = ai.definePrompt({
    name: 'seoAnalyzerPrompt',
    input: { schema: z.object({
        url: z.string(),
        keyword: z.string(),
        pageContent: z.string(),
    })},
    output: { schema: SeoAnalysisOutputSchema },
    prompt: `You are "Serp," an expert SEO analyst AI. Your task is to analyze the provided webpage content for on-page SEO best practices, focusing on a specific keyword.

**Analysis Context:**
- **URL:** {{{url}}}
- **Target Keyword:** "{{{keyword}}}"

**Webpage Content:**
"""
{{{pageContent}}}
"""

**Instructions:**
1.  **SEO Score:** Based on your overall analysis, provide a score from 0-100. Higher scores mean better on-page SEO for the target keyword.
2.  **Summary:** Write a one-paragraph summary of the page's SEO strengths and weaknesses.
3.  **Title Analysis:**
    *   Check if the keyword is present in the page title.
    *   Check if the title length is optimal (around 50-60 characters).
    *   Provide a recommendation for improvement.
4.  **Meta Description Analysis:**
    *   Check if the keyword is present.
    *   Check if the length is optimal (around 150-160 characters).
    *   Provide a recommendation.
5.  **Headings Analysis:**
    *   Check if there is only one H1 heading.
    *   Check if the keyword is present in the H1.
    *   Check if the keyword is present in at least one H2 heading.
    *   Provide recommendations.
6.  **Content Analysis:**
    *   Calculate the keyword density.
    *   Check if the keyword appears within the first 100 words.
    *   Provide recommendations on content length, keyword placement, and the use of related semantic keywords.

Return a complete and structured analysis in the specified JSON format.
`,
})


const seoAnalyzerFlow = ai.defineFlow(
  {
    name: 'seoAnalyzerFlow',
    inputSchema: SeoAnalysisInputSchema,
    outputSchema: SeoAnalysisOutputSchema,
  },
  async ({ url, keyword }) => {
    
    // Step 1: Use the web scraper agent to get the page content.
    const scrapedData = await scrapeAndSummarize({ source: url, isUrl: true });
    
    if (!scrapedData.summary) {
      throw new Error(`Could not scrape content from ${"'" + url + "'"}. The URL may be inaccessible or javascript-rendered.`);
    }

    // Step 2: Use the SEO specialist agent to get structured analysis.
    const { output } = await prompt({
        url,
        keyword,
        pageContent: scrapedData.summary,
    });
    
    return output!;
  }
);
