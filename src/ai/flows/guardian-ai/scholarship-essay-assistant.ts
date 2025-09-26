
'use server';

/**
 * @fileOverview An AI agent that assists in drafting a personal statement for a scholarship.
 */
import { ai } from '@/ai/genkit';
import { 
    ScholarshipEssayInputSchema, 
    type ScholarshipEssayInput, 
    ScholarshipEssayOutputSchema,
    type ScholarshipEssayOutput 
} from './scholarship-essay-assistant.schema';


const prompt = ai.definePrompt({
    name: 'scholarshipEssayPrompt',
    input: { schema: ScholarshipEssayInputSchema },
    output: { schema: ScholarshipEssayOutputSchema },
    prompt: `You are an expert academic advisor and writing coach. Your task is to draft a compelling personal statement for a student applying for a scholarship.

**Scholarship Details:**
- **Name:** {{{scholarship.scholarshipName}}}
- **Institution:** {{{scholarship.institution}}}
- **Field of Study:** {{{scholarship.fieldOfStudy}}}
- **Eligibility/Focus:** {{{scholarship.eligibilitySummary}}}

**Student's CV Document:**
{{media url=cvDataUri}}

**Instructions:**
1.  **Analyze the CV:** Read the student's CV to understand their academic background, work experience, skills, and any projects or achievements.
2.  **Analyze the Scholarship:** Understand the focus of the scholarship from its name and eligibility summary.
3.  **Draft a Personal Statement:** Write a persuasive and well-structured personal statement (around 400-500 words) in Markdown format.
    *   **Introduction:** Start with a strong opening that states the student's interest in the '{{{scholarship.fieldOfStudy}}}' and the specific '{{{scholarship.scholarshipName}}}'.
    *   **Body Paragraphs:**
        *   Connect the student's academic and professional experiences from their CV to the scholarship's focus.
        *   Highlight specific skills or projects from the CV that are relevant.
        *   Explain why the student is a strong candidate and how this scholarship will help them achieve their future goals.
    *   **Conclusion:** End with a strong closing statement summarizing their interest and expressing gratitude for the opportunity.
4.  **Tone:** Maintain a professional, confident, and enthusiastic tone.

Return only the generated essay in the 'essay' field.
`,
});

const generateScholarshipEssayFlow = ai.defineFlow(
    {
        name: 'generateScholarshipEssayFlow',
        inputSchema: ScholarshipEssayInputSchema,
        outputSchema: ScholarshipEssayOutputSchema,
    },
    async (input) => {
        const llmResponse = await ai.generate({
          prompt: prompt,
          input: input,
          model: 'googleai/gemini-1.5-flash',
          output: {
            format: 'json',
            schema: ScholarshipEssayOutputSchema,
          }
        });

        return llmResponse.output!;
    }
);

export async function generateScholarshipEssay(input: ScholarshipEssayInput): Promise<ScholarshipEssayOutput> {
    return generateScholarshipEssayFlow(input);
}
