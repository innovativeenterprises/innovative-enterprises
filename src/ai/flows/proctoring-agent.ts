
'use server';

/**
 * @fileOverview An AI agent that analyzes an exam session for academic integrity.
 */

import { ai } from '@/ai/genkit';
import {
    ProctoringInputSchema,
    ProctoringInput,
    ProctoringOutputSchema,
    ProctoringOutput,
} from './proctoring-agent.schema';


export async function analyzeExamSession(input: ProctoringInput): Promise<ProctoringOutput> {
  return proctoringAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proctoringAgentPrompt',
  input: { schema: ProctoringInputSchema.extend({ generatedId: z.string() }) },
  output: { schema: ProctoringOutputSchema },
  prompt: `You are an expert AI Proctoring Agent. Your task is to analyze a log transcript from a remotely monitored exam session and identify any potential academic integrity violations.

**Session Details:**
- Student ID: {{{studentId}}}
- Exam ID: {{{examId}}}

**Session Log / Transcript:**
"""
{{{sessionTranscript}}}
"""

**Rules for Analysis:**
-   **Unidentified Voice Detected:** Triggered if the log shows "unidentified speech" or "second voice". Severity is High.
-   **Student Left View:** Triggered if the log shows "student not in frame" or "camera obstructed". Severity is High.
-   **Mobile Phone Detected:** Triggered if the log mentions "mobile phone detected" or "cellphone screen reflection". Severity is High.
-   **Multiple Faces Detected:** Triggered if the log shows "second face detected". Severity is High.
-   **Copy/Paste Activity:** Triggered if the log shows "paste event detected" or "switching to external window". Severity is Medium.

**Your Task:**
1.  **Use the Provided Report ID:** The Report ID for this analysis is {{{generatedId}}}. You MUST use this exact ID in the 'reportId' output field. Do not create a new one.
2.  **Identify Violations:** Read through the session transcript and identify every event that matches the rules above. For each one, create a violation object with the timestamp, type, severity, and evidence.
3.  **Calculate Overall Risk Score:** Based on the number and severity of violations, calculate an overall risk score from 0 to 100.
    *   0: No violations.
    *   1-40: Low risk (e.g., one low-severity violation).
    *   41-70: Medium risk (e.g., multiple low-severity or one medium-severity violation).
    *   71-100: High risk (e.g., any high-severity violation).
4.  **Write Summary:** Write a brief, one-sentence summary of the session's integrity. (e.g., "The session appears clean with no violations." or "The session was flagged for multiple high-severity violations requiring immediate review.")

Return the complete analysis in the specified structured JSON format.
`,
});

const proctoringAgentFlow = ai.defineFlow(
  {
    name: 'proctoringAgentFlow',
    inputSchema: ProctoringInputSchema,
    outputSchema: ProctoringOutputSchema,
  },
  async (input) => {
    // Generate a unique, deterministic ID within the flow itself.
    const generatedId = `PR-EXAM-${input.examId}-${String(new Date().getTime()).slice(-4)}`;
    
    const { output } = await prompt({ ...input, generatedId });
    
    if(!output) {
        throw new Error("Failed to get a response from the proctoring agent.");
    }
    
    return output;
  }
);
