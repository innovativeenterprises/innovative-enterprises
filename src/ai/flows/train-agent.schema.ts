

/**
 * @fileOverview Schemas and types for the AI Agent Training flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the AI agent training flow.
 */

import { z } from 'zod';

const QaPairSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  answer: z.string().min(1, 'Answer cannot be empty.'),
});

const KnowledgeFileSchema = z.object({
    fileName: z.string().describe("The name of the uploaded file."),
    content: z.string().describe("The Base64-encoded content of the file."),
});

export const TrainAgentInputSchema = z.object({
  agentId: z.string().describe('The ID or name of the agent to be trained.'),
  knowledgeDocuments: z.array(KnowledgeFileSchema).optional().describe(
    "A list of knowledge documents, each with a filename and its Base64-encoded content."
  ),
  knowledgeUrls: z.array(z.string().url()).optional().describe('A list of URLs containing knowledge content.'),
  qaPairs: z.array(QaPairSchema).optional().describe('A list of question-answer pairs for fine-tuning.'),
});
export type TrainAgentInput = z.infer<typeof TrainAgentInputSchema>;

export const TrainAgentOutputSchema = z.object({
  jobId: z.string().describe('A unique identifier for the submitted training job.'),
  status: z.string().describe('The current status of the training job.'),
  message: z.string().describe('A confirmation message for the user.'),
});
export type TrainAgentOutput = z.infer<typeof TrainAgentOutputSchema>;
