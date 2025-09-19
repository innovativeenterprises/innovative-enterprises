
'use server';

/**
 * @fileOverview An AI agent that enhances CVs for ATS compatibility.
 *
 * This file contains the server-side logic for the CV enhancement flow.
 * It is intended to be used as a Next.js Server Action.
 *
 * - analyzeCv - A function that analyzes a CV and provides ATS recommendations.
 * - generateEnhancedCv - A function that generates a new CV based on user input.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  CvAnalysisInput,
  CvAnalysisInputSchema,
  CvAnalysisOutput,
  CvAnalysisOutputSchema,
  CvGenerationInput,
  CvGenerationInputSchema,
  CvGenerationOutput,
  CvGenerationOutputSchema,
} from './cv-enhancement.schema';

export async function analyzeCv(input: CvAnalysisInput): Promise<CvAnalysisOutput> {
  return cvAnalysisFlow(input);
}

export async function generateEnhancedCv(input: CvGenerationInput): Promise<CvGenerationOutput> {
  return cvGenerationFlow(input);
}


const analysisPrompt = ai.definePrompt({
  name: 'cvAnalysisPrompt',
  input: { schema: CvAnalysisInputSchema }, // Input is now the data URI
  output: { schema: CvAnalysisOutputSchema },
  prompt: `You are an expert HR professional specializing in optimizing resumes for Applicant Tracking Systems (ATS).
Your task is to analyze the provided CV document and give detailed, actionable feedback to improve its ATS compatibility.

CV Document:
{{media url=cvDataUri}}

First, perform robust OCR and text extraction to get the clean text from the document, which may be a PDF, image, or Word file.
Then, analyze the extracted CV text based on the following criteria and provide a structured response.
1.  **Overall Score**: Provide a score from 0 to 100 representing how well the CV is optimized for ATS.
2.  **Summary**: Briefly summarize the key areas for improvement.
3.  **Contact Information**: Check for standard format (Name, Phone, Email, LinkedIn URL). Ensure it's easily parsable.
4.  **Work Experience**: Check for standard formatting (Job Title, Company, Dates, Bullet Points). Ensure action verbs are used.
5.  **Skills**: Ensure there is a dedicated skills section with a list of relevant hard skills.
6.  **Education**: Check for standard format (Degree, University, Graduation Date).
7.  **Formatting**: Analyze the overall formatting based on the text structure. The structure should be logical and easy to follow.

For each section (Contact Info, Work Experience, etc.), determine if it is compliant and provide a list of specific, actionable suggestions for improvement. If a section is already good, provide positive reinforcement. If you cannot find a section, state that and recommend adding it.
`,
});

const cvAnalysisFlow = ai.defineFlow(
  {
    name: 'cvAnalysisFlow',
    inputSchema: CvAnalysisInputSchema,
    outputSchema: CvAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    if (!output) {
      throw new Error("Could not analyze the provided CV document.");
    }
    return output;
  }
);


const generationPrompt = ai.definePrompt({
  name: 'cvGenerationPrompt',
  input: { schema: CvGenerationInputSchema },
  output: { schema: CvGenerationOutputSchema },
  prompt: `You are an expert CV writer and ATS specialist. Your task is to rewrite and enhance the provided CV and generate a matching cover letter, both highly optimized for the target position and language(s).

Original CV Document: {{media url=cvDataUri}}
Target Position: {{{targetPosition}}}
{{#if jobAdvertisement}}
Job Advertisement:
{{{jobAdvertisement}}}
{{/if}}
Languages: {{{json languages}}}

First, rewrite the entire CV. Use the information from the original CV but tailor the language, keywords, and structure to perfectly match the target position and the provided job advertisement. 
- The CV output should be a complete CV in Markdown format.
- If multiple languages are requested, generate the CV in the first language listed.
- Incorporate strong action verbs and quantify achievements where possible.
- Ensure the formatting is clean, professional, and easily parsable by any ATS.

Second, write a compelling and professional cover letter. The cover letter should:
- Be tailored to the {{{targetPosition}}}.
- Reference key requirements from the job advertisement if provided.
- Highlight the most relevant skills and experiences from the rewritten CV.
- Maintain a professional tone.
- The output should be a complete cover letter in Markdown format.
- If multiple languages are requested, generate the cover letter in the first language listed.

Finally, after generating the new CV, estimate a new, improved "newOverallScore" for the enhanced CV you just created, on the same 0-100 scale.
`,
});

const cvGenerationFlow = ai.defineFlow(
  {
    name: 'cvGenerationFlow',
    inputSchema: CvGenerationInputSchema,
    outputSchema: CvGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await generationPrompt(input);
    return output!;
  }
);
