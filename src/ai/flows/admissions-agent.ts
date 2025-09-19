
'use server';

/**
 * @fileOverview An AI agent that analyzes student admission applications.
 */

import { ai } from '@/ai/genkit';
import crypto from 'crypto';
import {
    AdmissionsAgentInputSchema,
    type AdmissionsAgentInput,
    AdmissionsAgentOutputSchema,
    type AdmissionsAgentOutput,
} from './admissions-agent.schema';

export async function analyzeApplication(input: AdmissionsAgentInput): Promise<AdmissionsAgentOutput> {
  return admissionsAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'admissionsAgentPrompt',
  input: { schema: AdmissionsAgentInputSchema.extend({ generatedId: ai.defineSchema('generatedId', z => z.string()) }) },
  output: { schema: AdmissionsAgentOutputSchema },
  prompt: `You are "Admito," an expert AI admissions officer for a prestigious university. Your task is to conduct a preliminary analysis of a student's application to provide a structured summary for the human admissions committee.

**Applicant's Information:**
- **Name:** {{{fullName}}}
- **Date of Birth:** {{{dateOfBirth}}}
- **Nationality:** {{{nationality}}}
- **Program of Interest:** {{{programOfInterest}}}

**Academic History:**
{{#each academicHistory}}
- **School:** {{this.schoolName}}
  - **Qualification:** {{this.qualification}}
  - **Grade:** {{this.grade}}
{{/each}}

**Personal Statement:**
"""
{{{personalStatement}}}
"""

{{#if transcriptUri}}
**Transcript Document:**
{{media url=transcriptUri}}
(Analyze the attached transcript for course details, grades, and any remarks.)
{{/if}}

**Your Task:**
1.  **Use the Provided Application ID:** The application ID for this analysis is {{{generatedId}}}. You MUST use this exact ID in the 'applicationId' output field. Do not create a new one.
2.  **Summarize Application:** Write a concise, one-paragraph summary of the applicant. Highlight their academic background, interests from their personal statement, and overall suitability for the applied program.
3.  **Calculate Readiness Score:** Based on all available information (grades, personal statement quality, relevance to the program), provide a readiness score from 0 to 100. Higher grades and a well-written, relevant personal statement should result in a higher score.
4.  **Identify Key Strengths:** List 2-3 key strengths of the applicant (e.g., "Excellent grades in science subjects," "Strong passion for engineering shown in personal statement," "Consistent academic performance.").
5.  **Note Areas for Review:** List any potential concerns or areas that a human officer should review more closely (e.g., "Slightly lower grades in mathematics," "Personal statement is generic," "Gap in academic history.").
6.  **Recommend Next Step:** Based on your analysis, recommend a next step from the available options: 'Interview', 'Conditional Offer', 'Further Review', 'Reject'.

Return the complete analysis in the specified structured JSON format.
`,
});

const admissionsAgentFlow = ai.defineFlow(
  {
    name: 'admissionsAgentFlow',
    inputSchema: AdmissionsAgentInputSchema,
    outputSchema: AdmissionsAgentOutputSchema,
  },
  async (input) => {
    // Generate a unique ID using crypto for better uniqueness.
    const generatedId = `APP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    const { output } = await prompt({ ...input, generatedId });
    return output!;
  }
);
