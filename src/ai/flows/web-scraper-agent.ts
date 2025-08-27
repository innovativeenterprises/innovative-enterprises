
'use server';

/**
 * @fileOverview An AI agent that can scrape web pages and summarize information.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { WebScraperInputSchema, WebScraperOutputSchema, type WebScraperInput, type WebScraperOutput } from './web-scraper-agent.schema';

const fetchWebPageTool = ai.defineTool(
    {
        name: 'fetchWebPage',
        description: 'Fetches the raw text content of a given URL. This should only be used for direct URLs.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({ content: z.string() }),
    },
    async ({ url }) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return { content: `Error: Failed to fetch URL. Status: ${response.status}` };
            }
            // This is a simplified version. A real implementation would need a library like Cheerio or JSDOM to properly parse HTML.
            const textContent = await response.text(); 
            // A basic attempt to clean up HTML tags for the LLM
            const cleanedContent = textContent.replace(/<style[^>]*>.*?<\/style>/gs, '') // remove style tags
                                           .replace(/<script[^>]*>.*?<\/script>/gs, '') // remove script tags
                                           .replace(/<[^>]+>/g, ' ') // remove all other tags
                                           .replace(/\s\s+/g, ' ') // collapse whitespace
                                           .trim();
            return { content: cleanedContent.substring(0, 20000) }; // Limit content to avoid overly large payloads
        } catch (error: any) {
            return { content: `Error: Could not fetch the page. ${error.message}` };
        }
    }
);

const summarizeWebPagePrompt = ai.definePrompt({
    name: 'summarizeWebPagePrompt',
    input: { schema: z.object({ content: z.string(), sourceUrl: z.string() }) },
    output: { schema: WebScraperOutputSchema },
    prompt: `You are an expert research analyst. You have been given the raw text content from a webpage.
    
Webpage Content:
"""
{{{content}}}
"""

Your task is to analyze this content and provide a structured summary.
1.  **Title**: Extract the most likely title of the page.
2.  **Summary**: Write a comprehensive, multi-paragraph summary of the page's main topic and arguments.
3.  **Key Points**: List the 5-7 most important facts, findings, or conclusions from the text.
4.  **Source**: Return the original source URL: {{{sourceUrl}}}

Return the response in the specified JSON format.
`,
});

const searchSummaryPrompt = ai.definePrompt({
    name: 'searchSummaryPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: WebScraperOutputSchema },
    prompt: `You are an expert research analyst. A user wants to know more about the following topic: "{{{query}}}".

Your task is to act as if you have searched the web and are synthesizing the results from the top 5 search hits.
1.  **Title**: Create a summary title for the research, like "Research Summary for '{{{query}}}'".
2.  **Summary**: Write a comprehensive, multi-paragraph summary that provides a general overview of the topic. Cover the key aspects, different viewpoints, and important entities related to the query.
3.  **Key Points**: List the 5-7 most important facts, definitions, or common findings related to this topic.
4.  **Source**: Provide a URL for a plausible search engine result, e.g., \`https://www.google.com/search?q={{{query}}}\`

Return the response in the specified JSON format.
`
})


export const scrapeAndSummarize = ai.defineFlow(
  {
    name: 'scrapeAndSummarize',
    inputSchema: WebScraperInputSchema,
    outputSchema: WebScraperOutputSchema,
  },
  async (input) => {

    if (input.isUrl) {
      const pageContent = await fetchWebPageTool({ url: input.source });
      const { output } = await summarizeWebPagePrompt({ content: pageContent.content, sourceUrl: input.source });
      return output!;
    } else {
      // Simulate a web search by asking the LLM to synthesize information.
      const { output } = await searchSummaryPrompt({ query: input.source });
      return output!;
    }
  }
);
