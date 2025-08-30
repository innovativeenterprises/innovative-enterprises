/**
 * @fileOverview Schemas for the Web Scraper & Researcher AI flow.
 */
import { z } from 'zod';

export const WebScraperInputSchema = z.object({
  source: z.string().describe('A URL to a specific webpage or a general web search query.'),
  isUrl: z.boolean().describe('Whether the source is a direct URL or a general search query.'),
});
export type WebScraperInput = z.infer<typeof WebScraperInputSchema>;

const ExtractedLinkSchema = z.object({
    url: z.string().url().describe("The full URL of the link found."),
    text: z.string().describe("The anchor text of the link."),
    description: z.string().describe("A brief, AI-generated description of what the link is likely about based on its URL and anchor text."),
});
export type ExtractedLink = z.infer<typeof ExtractedLinkSchema>;


export const WebScraperOutputSchema = z.object({
  title: z.string().optional().describe('The title of the webpage or a summary title for the search query.'),
  summary: z.string().describe('A detailed summary of the content found.'),
  keyPoints: z.array(z.string()).optional().describe('A bulleted list of the most important key points or findings.'),
  source: z.string().optional().describe('The primary URL that was scraped or the search engine URL used.'),
  extractedLinks: z.array(ExtractedLinkSchema).optional().describe("A list of classified links extracted from the webpage."),
});
export type WebScraperOutput = z.infer<typeof WebScraperOutputSchema>;
