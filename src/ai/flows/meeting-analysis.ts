'use server';

/**
 * @fileOverview An AI agent that analyzes meeting transcripts to generate minutes and action items.
 *
 * - analyzeMeeting - A function that performs the analysis.
 */

import { ai } from '@/ai/genkit';
import {
    MeetingAnalysisInput,
    MeetingAnalysisInputSchema,
    MeetingAnalysisOutput,
    MeetingAnalysisOutputSchema,
} from './meeting-analysis.schema';

export async function analyzeMeeting(input: MeetingAnalysisInput): Promise<MeetingAnalysisOutput> {
  return meetingAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'meetingAnalysisPrompt',
  input: { schema: MeetingAnalysisInputSchema },
  output: { schema: MeetingAnalysisOutputSchema },
  prompt: `You are an expert executive assistant specializing in creating concise and accurate meeting minutes.
Your task is to analyze the provided meeting transcript and create a structured summary.

**Meeting Participants:**
{{{participants}}}

**Meeting Transcript:**
{{{transcript}}}

**Instructions:**
1.  **Generate a Title:** Create a short, descriptive title for the meeting based on the transcript content.
2.  **Summarize the Meeting:** Write a one-paragraph summary of the key outcomes and overall purpose of the meeting.
3.  **List Discussion Points:** Identify and list the main topics that were discussed.
4.  **List Decisions Made:** Identify and list any clear decisions that were made.
5.  **Extract Action Items:** Carefully review the transcript to find all action items, tasks, and follow-up procedures. For each one, identify the specific task, who it was assigned to (the 'assignee'), and the due date if one was mentioned. The assignee must be one of the listed participants.

Return the results in the specified structured format.
`,
});

const meetingAnalysisFlow = ai.defineFlow(
  {
    name: 'meetingAnalysisFlow',
    inputSchema: MeetingAnalysisInputSchema,
    outputSchema: MeetingAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
