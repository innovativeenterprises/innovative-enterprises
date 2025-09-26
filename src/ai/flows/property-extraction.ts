
'use server';

/**
 * @fileOverview An AI agent that extracts structured property data from scraped web content.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeAndSummarize } from './web-scraper-agent';

const PropertyExtractionInputSchema = z.object({
  url: z.string().url().describe("The URL of the property listing to scrape and analyze."),
});

const PropertyExtractionOutputSchema = z.object({
  title: z.string().optional().describe("The listing title or headline."),
  propertyType: z.string().optional().describe("e.g., Villa, Apartment, Townhouse"),
  listingType: z.string().optional().describe("e.g., For Sale, For Rent"),
  location: z.string().optional(),
  price: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  areaSqM: z.number().optional(),
  description: z.string().optional(),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  agentEmail: z.string().optional(),
});
export type PropertyExtractionOutput = z.infer<typeof PropertyExtractionOutputSchema>;

const propertyExtractionPrompt = ai.definePrompt({
    name: 'propertyExtractionPrompt',
    input: { schema: z.object({ scrapedContent: z.string(), url: z.string() })},
    output: { schema: PropertyExtractionOutputSchema },
    prompt: `You are an expert real estate data extraction agent.
    Your task is to analyze the unstructured text content scraped from a property listing webpage and extract key, structured information.

    **Source URL:** {{{url}}}
    **Scraped Web Content:**
    """
    {{{scrapedContent}}}
    """

    **Instructions:**
    Carefully read the text and extract the following details. If a piece of information cannot be found, leave the field empty.
    - **title:** The main headline of the listing.
    - **propertyType:** The type of property (e.g., Villa, Apartment).
    - **listingType:** Whether it is 'For Sale' or 'For Rent'.
    - **location:** The neighborhood, city, or area.
    - **price:** The numerical price. Ignore currency symbols and text like 'OMR'.
    - **bedrooms:** The number of bedrooms.
    - **bathrooms:** The number of bathrooms.
    - **areaSqM:** The size of the property in square meters.
    - **description:** A summary of the property's description.
    - **agentName:** The name of the real estate agent or contact person.
    - **agentPhone:** The agent's phone number.
    - **agentEmail:** The agent's email address.

    Return only the structured JSON data.
    `,
});

export const extractPropertyDetailsFromUrl = ai.defineFlow(
  {
    name: 'extractPropertyDetailsFromUrl',
    inputSchema: PropertyExtractionInputSchema,
    outputSchema: PropertyExtractionOutputSchema,
  },
  async ({ url }) => {
    // Step 1: Use the web scraper agent to get the page content.
    const scrapedData = await scrapeAndSummarize({ source: url, isUrl: true });
    
    if (!scrapedData.summary) {
      throw new Error(`Could not scrape content from ${url}.`);
    }

    // Step 2: Use the property extraction specialist agent to get structured data.
    const { output } = await propertyExtractionPrompt({
        scrapedContent: scrapedData.summary,
        url,
    });
    
    return output!;
  }
);
