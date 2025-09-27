
'use server';

import { z } from 'zod';

/**
 * @fileOverview Schemas for the Web Scraper AI agent.
 */

export const WebScraperInputSchema = z.object({
  source: z.string().describe("The URL to scrape or the search query to perform."),
  isUrl: z.boolean().describe("Whether the source is a URL or a general search query."),
});
export type WebScraperInput = z.infer<typeof WebScraperInputSchema>;


export const ExtractedLinkSchema = z.object({
  text: z.string().describe("The anchor text of the hyperlink."),
  href: z.string().url().describe("The absolute URL of the hyperlink."),
  description: z.string().optional().describe("A brief, one-sentence description of what the link likely points to."),
});
export type ExtractedLink = z.infer<typeof ExtractedLinkSchema>;


export const WebScraperOutputSchema = z.object({
  title: z.string().describe("The main title of the scraped page or research summary."),
  summary: z.string().describe("A comprehensive summary of the content."),
  keyPoints: z.array(z.string()).optional().describe("A list of the most important facts or findings."),
  extractedLinks: z.array(ExtractedLinkSchema).optional().describe("A list of hyperlinks found on the page, with descriptions."),
  source: z.string().describe("The original source URL or search query."),
});
export type WebScraperOutput = z.infer<typeof WebScraperOutputSchema>;
