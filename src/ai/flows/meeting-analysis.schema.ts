/**
 * @fileOverview Schemas and types for the Online Meeting Agent flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the meeting analysis AI flow.
 */

import { z } from 'zod';

export const MeetingAnalysisInputSchema = z.object({
  transcript: z.string().min(50, 'Transcript must be at least 50 characters.'),
  participants: z.string().min(1, 'Please list at least one participant.'),
});
export type MeetingAnalysisInput = z.infer<typeof MeetingAnalysisInputSchema>;


const ActionItemSchema = z.object({
    task: z.string().describe("A clear and concise description of the action item."),
    assignee: z.string().describe("The name of the person or team responsible for the task."),
    dueDate: z.string().optional().describe("The due date for the task, if mentioned (e.g., YYYY-MM-DD)."),
});

export const MeetingAnalysisOutputSchema = z.object({
  title: z.string().describe("A concise, relevant title for the meeting."),
  summary: z.string().describe("A brief, one-paragraph summary of the entire meeting."),
  discussionPoints: z.array(z.string()).describe("A bulleted list of the main topics discussed."),
  decisionsMade: z.array(z.string()).describe("A bulleted list of all key decisions made during the meeting."),
  actionItems: z.array(ActionItemSchema).describe("A list of all assigned action items, tasks, or follow-up procedures."),
});
export type MeetingAnalysisOutput = z.infer<typeof MeetingAnalysisOutputSchema>;
