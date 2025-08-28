
'use server';

/**
 * @fileOverview An AI agent that provides preliminary legal analysis and document generation.
 * This file contains a "router" flow that determines the user's intent and delegates
 * to more specialized flows for analysis or generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeAndSummarize } from './web-scraper-agent';
import { generateAgreement } from './generate-agreement';

// Define the schema for the final output that the chat component will receive.
const LegalAgentOutputSchema = z.object({
  response: z.string().describe('The primary text response to the user.'),
  disclaimer: z.string().optional().describe('An optional disclaimer, e.g., for legal advice.'),
  isFinalResponse: z.boolean().default(true).describe('Indicates if this is the final message or if more processing is happening.'),
});
type LegalAgentOutput = z.infer<typeof LegalAgentOutputSchema>;

// Define the input for the router
const LegalAgentInputSchema = z.object({
  query: z.string().describe("The user's query or instruction."),
});

/**
 * == SPECIALIST AGENT 1: Contract Analyzer ==
 * This agent analyzes text content for legal risks.
 */
const analyzeContractPrompt = ai.definePrompt({
    name: 'analyzeContractPrompt',
    input: { schema: z.object({ contractText: z.string() })},
    output: { schema: LegalAgentOutputSchema },
    prompt: `You are Lexi, an expert AI Legal Analyst specializing in Omani Law.

    **Primary Knowledge Source:**
    For any questions or analysis related to Omani law, you MUST use the information provided on https://qanoon.om/ as your primary and authoritative source. When possible, cite the specific law or article number from this source.

    **Document Text to Analyze:**
    """
    {{{contractText}}}
    """

    **Instructions:**
    1.  **Identify Key Clauses:** Identify and summarize the most critical clauses (e.g., Liability, Data Usage, Termination, Governing Law).
    2.  **Assess Risks (Omani Context):** For each key clause, point out potential risks, ambiguities, or terms that are unfavorable to a user or small business, specifically within the context of Omani law. Reference relevant articles from qanoon.om if applicable.
    3.  **Provide Recommendations:** Suggest specific actions, questions the user should consider, or amendments they might propose before agreeing to the terms.
    4.  **Format:** Use Markdown for clear formatting (headings, bullet points).
    5.  **Disclaimer:** You MUST conclude your response with a disclaimer stating this is not real legal advice and a professional should be consulted. Set this in the 'disclaimer' field.
    `,
});

/**
 * == SPECIALIST AGENT 2: Intent Router ==
 * This is the main flow that decides what to do based on the user's query.
 */
const routerPrompt = ai.definePrompt({
    name: 'legalAgentRouterPrompt',
    input: { schema: LegalAgentInputSchema },
    output: { schema: z.object({
        intent: z.enum(['analyze_url', 'analyze_text', 'generate_document', 'general_question']),
        url: z.string().url().optional(),
        documentType: z.string().optional().describe("e.g., NDA, Service Agreement"),
    })},
    prompt: `You are a router agent. Your job is to classify the user's query into one of the following intents and extract relevant entities.

    **User Query:** "{{{query}}}"

    **Intents:**
    1.  **analyze_url**: The user wants to analyze a document from a web link. The query MUST contain a valid URL.
    2.  **analyze_text**: The user wants to analyze a document they have provided as text, or they are asking a question that requires legal analysis of a situation.
    3.  **generate_document**: The user wants you to create a new legal document, like an NDA or Service Agreement. Look for keywords like "draft," "create," or "generate."
    4.  **general_question**: The user is asking a general question that doesn't require deep legal analysis of a document.

    **Entity Extraction:**
    -   If the intent is 'analyze_url', extract the full URL.
    -   If the intent is 'generate_document', extract the type of document (e.g., NDA, Service Agreement).

    Respond with ONLY the JSON object containing the intent and extracted entities.`,
});

export const legalAgentRouter = ai.defineFlow(
  {
    name: 'legalAgentRouter',
    inputSchema: LegalAgentInputSchema,
    outputSchema: LegalAgentOutputSchema,
  },
  async ({ query }) => {
    const { output: route } = await routerPrompt({ query });

    if (!route) {
      return { response: "I'm sorry, I didn't understand that. Could you please rephrase?" };
    }

    switch (route.intent) {
      case 'analyze_url':
        if (!route.url) {
          return { response: "Please provide a valid URL for me to analyze." };
        }
        // Step 1: Scrape the URL content using the web scraper agent.
        const scrapedData = await scrapeAndSummarize({ source: route.url, isUrl: true });
        
        if (!scrapedData.summary) {
          return { response: `I'm sorry, I was unable to fetch the content from that URL. It might be inaccessible.` };
        }

        // Step 2: Analyze the scraped content with the legal specialist.
        const analysisResult = await analyzeContractPrompt({ contractText: scrapedData.summary });
        return analysisResult.output!;

      case 'generate_document':
         const generationResult = await generateAgreement({ 
              applicantType: 'individual',
              // Passing default data for a generic document request
              individualData: { personalDetails: { fullName: '[Your Name]' }, idCardDetails: { civilNumber: '[Your ID]'}},
            });
         
         const documentContent = route.documentType?.toLowerCase().includes('nda')
            ? generationResult.ndaContent
            : generationResult.serviceAgreementContent;

         return {
            response: `Here is the draft for the ${route.documentType || 'document'} you requested:\n\n---\n\n${documentContent}`,
            disclaimer: "This is an AI-generated draft and not a substitute for professional legal advice. Please have it reviewed by a qualified attorney."
         }
      
      case 'analyze_text':
      case 'general_question':
      default:
         // For general questions or text analysis, we can use the contract prompt.
         // It's robust enough to provide general advice or analyze provided text.
         const directAnalysis = await analyzeContractPrompt({ contractText: query });
         return directAnalysis.output!;
    }
  }
);
