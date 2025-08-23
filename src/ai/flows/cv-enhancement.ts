'use server';

/**
 * @fileOverview An AI agent that enhances CVs for ATS compatibility.
 *
 * This file contains the server-side logic for the CV enhancement flow.
 * It is intended to be used as a Next.js Server Action.
 *
 * - enhanceCv - A function that analyzes a CV and provides ATS recommendations.
 */

import { ai } from '@/ai/genkit';
import {
  CvEnhancementInput,
  CvEnhancementInputSchema,
  CvEnhancementOutput,
  CvEnhancementOutputSchema,
} from './cv-enhancement.schema';

export async function enhanceCv(input: CvEnhancementInput): Promise<CvEnhancementOutput> {
  return cvEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cvEnhancementPrompt',
  input: { schema: CvEnhancementInputSchema },
  output: { schema: CvEnhancementOutputSchema },
  prompt: `You are an expert HR professional specializing in optimizing resumes for Applicant Tracking Systems (ATS).
Your task is to analyze the provided CV and give detailed, actionable feedback to improve its ATS compatibility.

CV Document: {{media url=cvDataUri}}

Analyze the CV based on the following criteria and provide a structured response:
1.  **Overall Score**: Provide a score from 0 to 100 representing how well the CV is optimized for ATS.
2.  **Summary**: Briefly summarize the key areas for improvement.
3.  **Contact Information**: Check for standard format (Name, Phone, Email, LinkedIn URL). Ensure it's easily parsable.
4.  **Work Experience**: Check for standard formatting (Job Title, Company, Dates, Bullet Points). Ensure action verbs are used. Check for keywords relevant to common job descriptions.
5.  **Skills**: Ensure there is a dedicated skills section with a list of relevant hard skills. Avoid graphics or complex formatting for skills.
6.  **Education**: Check for standard format (Degree, University, Graduation Date).
7.  **Formatting**: Analyze the overall formatting. The CV should be in a single column, use standard fonts (like Calibri, Arial, Times New Roman), and have no images, tables, or complex headers/footers. The file type should be checked (PDF or DOCX are best).

For each section (Contact Info, Work Experience, etc.), determine if it is compliant and provide a list of specific, actionable suggestions for improvement. If a section is already good, provide positive reinforcement.
`,
});

const cvEnhancementFlow = ai.defineFlow(
  {
    name: 'cvEnhancementFlow',
    inputSchema: CvEnhancementInputSchema,
    outputSchema: CvEnhancementOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
