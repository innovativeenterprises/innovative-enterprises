
'use server';

/**
 * @fileOverview An AI agent that can scrape web pages and summarize information.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { WebScraperInputSchema, WebScraperOutputSchema, type WebScraperInput, type WebScraperOutput } from './web-scraper-agent.schema';
import { initialProviders } from '@/lib/providers';

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

const queryProviderDatabaseTool = ai.defineTool(
    {
        name: 'queryProviderDatabase',
        description: 'Queries the internal database of registered service providers, freelancers, and partners. Use this for queries about finding specific types of partners, like "vetted developers" or "design agencies".',
        inputSchema: z.object({
            query: z.string().describe('A search query describing the provider to find, e.g., "UI/UX designers" or "vetted React developers".')
        }),
        outputSchema: z.object({
            results: z.array(z.object({
                name: z.string(),
                services: z.string(),
                status: z.string(),
            })).optional(),
            summary: z.string(),
        })
    },
    async({ query }) => {
        const queryLower = query.toLowerCase();
        const results = initialProviders.filter(provider => 
            provider.name.toLowerCase().includes(queryLower) ||
            provider.services.toLowerCase().includes(queryLower) ||
            provider.status.toLowerCase().includes(queryLower)
        );

        if (results.length === 0) {
            return { summary: "No providers found matching your query." };
        }

        const summary = `Found ${results.length} provider(s) matching your query. They are listed below.`;
        return { 
            results: results.map(p => ({ name: p.name, services: p.services, status: p.status })),
            summary,
        };
    }
);


const summarizeWebPagePrompt = ai.definePrompt({
    name: 'summarizeWebPagePrompt',
    input: { schema: z.object({ content: z.string(), sourceUrl: z.string() }) },
    output: { schema: WebScraperOutputSchema },
    tools: [queryProviderDatabaseTool],
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
    tools: [queryProviderDatabaseTool],
    prompt: `You are an expert research analyst. Your task is to respond to the user's query.

**User Query:** "{{{query}}}"

**Decision Tree:**
1.  **Check for Internal Database Query:** If the user's query is about finding internal partners, freelancers, or service providers (e.g., "Find me designers", "List all vetted developers"), you MUST use the \`queryProviderDatabaseTool\`.
2.  **Perform Web Search:** For all other general research queries (e.g., "market trends in AI", "how to build a website"), act as if you have searched the web and are synthesizing the results from the top 5 search hits.

**Web Search Instructions:**
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
      const llmResponse = await searchSummaryPrompt({ query: input.source });

      // Check if the LLM decided to use the database tool
      if (llmResponse.toolRequest?.name === 'queryProviderDatabase') {
        const toolResult = await llmResponse.toolRequest.run();
        const dbResponse = toolResult.output as z.infer<typeof queryProviderDatabaseTool.outputSchema>;
        
        // Format the database results into the standard WebScraperOutputSchema
        return {
            title: `Provider Database Search: "${input.source}"`,
            summary: dbResponse.summary,
            keyPoints: dbResponse.results?.map(r => `${r.name} (${r.status}) - Services: ${r.services}`),
            source: "Internal Provider Database"
        }
      }

      // If no tool was used, return the LLM's synthesized web search summary
      return llmResponse.output!;
    }
  }
);
