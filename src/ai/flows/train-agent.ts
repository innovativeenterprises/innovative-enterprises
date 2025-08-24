'use server';

/**
 * @fileOverview An AI flow that simulates the training of another AI agent.
 *
 * This file contains the server-side logic for submitting training data.
 * - trainAgent - A function that handles the training data submission.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    TrainAgentInput,
    TrainAgentInputSchema,
    TrainAgentOutput,
    TrainAgentOutputSchema,
} from './train-agent.schema';

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
{{/if}}

{{#if qaPairs}}
You have received {{qaPairs.length}} Question/Answer pair(s) for training.
{{/if}}

Based on this, generate a response:
1.  Create a unique 'jobId' for this training request. A random UUID-like string is fine.
2.  Set the 'status' to "Queued".
3.  Write a 'message' confirming that the training job for agent '{{{agentId}}}' has been received and is now in the queue. Mention the number of documents and Q&A pairs received.
`,
});

const trainAgentFlow = ai.defineFlow(
  {
    name: 'trainAgentFlow',
    inputSchema: TrainAgentInputSchema,
    outputSchema: TrainAgentOutputSchema,
  },
  async (input) => {
    // In a real application, you would connect this to a fine-tuning service
    // or a vector database ingestion pipeline.
    // For this prototype, we just pass the info to an LLM to get a confirmation.
    const { output } = await prompt(input);
    return output!;
  }
);
