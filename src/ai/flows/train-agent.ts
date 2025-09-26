

'use server';

/**
 * @fileOverview An AI flow that simulates the training of another AI agent.
 *
 * This file contains the server-side logic for submitting training data.
 * - trainAgent - a function that handles the training data submission.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    TrainAgentInput,
    TrainAgentInputSchema,
    TrainAgentOutput,
    TrainAgentOutputSchema,
} from './train-agent.schema';
import { scrapeAndSummarize } from './web-scraper-agent';

export async function trainAgent(input: TrainAgentInput): Promise<TrainAgentOutput> {
  return trainAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trainAgentPrompt',
  input: { schema: TrainAgentInputSchema },
  output: { schema: TrainAgentOutputSchema },
  prompt: `You are an AI that simulates a machine learning training pipeline.
Your task is to acknowledge the receipt of training data for a specified AI agent.

Agent to Train: {{{agentId}}}

{{#if knowledgeDocuments}}
You have received {{knowledgeDocuments.length}} knowledge document(s) for training.
File names:
{{#each knowledgeDocuments}}
- {{this.fileName}}
{{/each}}
{{/if}}
{{#if knowledgeUrls}}
You have received {{knowledgeUrls.length}} knowledge URL(s) for training.
URLs:
{{#each knowledgeUrls}}
- {{this}}
{{/each}}
{{/if}}
{{#if qaPairs}}
You have received {{qaPairs.length}} Question/Answer pair(s) for training.
{{/if}}

Based on this, generate a response:
1.  Create a unique 'jobId' for this training request. A random UUID-like string is fine.
2.  Set the 'status' to "Queued".
3.  Write a 'message' confirming that the training job for agent '{{{agentId}}}' has been received and is now in the queue. Mention the number of documents, URLs, and Q&A pairs received.
`,
});

const trainAgentFlow = ai.defineFlow(
  {
    name: 'trainAgentFlow',
    inputSchema: TrainAgentInputSchema,
    outputSchema: TrainAgentOutputSchema,
  },
  async (input) => {
    let scrapedContent: string[] = [];

    // If URLs are provided, scrape them using the web-scraper agent in parallel.
    if (input.knowledgeUrls && input.knowledgeUrls.length > 0) {
        console.log(`Scraping ${input.knowledgeUrls.length} URLs for training data...`);
        const scrapingJobs = input.knowledgeUrls.map(url => scrapeAndSummarize({ source: url, isUrl: true }));
        const results = await Promise.all(scrapingJobs);
        scrapedContent = results.map(r => r.summary);
        console.log(`Scraped content from ${results.length} URLs.`);
    }
    
    // In a real application, you would connect this to a fine-tuning service
    // or a vector database ingestion pipeline. The `scrapedContent` and the
    // content from `input.knowledgeDocuments` would be processed and stored.
    console.log('Received training job for agent:', input.agentId);
    console.log('Number of uploaded documents:', input.knowledgeDocuments?.length || 0);
    console.log('Number of Q&A pairs:', input.qaPairs?.length || 0);
    
    const { output } = await prompt(input);

    return output!;
  }
);

