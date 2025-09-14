

'use server';

/**
 * @fileOverview An AI agent that finds scholarship opportunities using the web scraper agent.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeAndSummarize } from '../web-scraper-agent';
import { 
    ScholarshipFinderInputSchema, 
    type ScholarshipFinderInput, 
    ScholarshipFinderOutputSchema,
    type ScholarshipFinderOutput 
} from './scholarship-agent.schema';


export async function findScholarships(input: ScholarshipFinderInput): Promise<ScholarshipFinderOutput> {
  return scholarshipFinderFlow(input);
}


const synthesizerPrompt = ai.definePrompt({
    name: 'scholarshipSynthesizerPrompt',
    input: { schema: z.object({
        inputQuery: ScholarshipFinderInputSchema,
        researchData: z.array(z.object({
            source: z.string().optional(),
            content: z.string(),
        })),
    })},
    output: { schema: ScholarshipFinderOutputSchema },
    prompt: `You are an expert guidance counselor AI. Your task is to analyze research data scraped from the web and extract a structured list of scholarship opportunities for a student.

**Student's Request:**
- **Field of Study:** {{{inputQuery.fieldOfStudy}}}
- **Study Level:** {{{inputQuery.studyLevel}}}
{{#if inputQuery.country}}
- **Preferred Country:** {{{inputQuery.country}}}
{{/if}}

**Scraped Research Data:**
'''
{{{json researchData}}}
'''

**Your Task:**
1.  **Analyze Research:** Carefully read through all the provided research data from various sources.
2.  **Identify Scholarships:** Identify distinct scholarship opportunities that match the student's request.
3.  **Extract Key Information:** For each scholarship found, extract the following details:
    *   **scholarshipName:** The official name of the scholarship.
    *   **institution:** The name of the university or organization offering it.
    *   **country:** The country of the institution.
    *   **fieldOfStudy:** The relevant field of study.
    *   **deadline:** The application deadline. If not found, state "Check official website".
    *   **eligibilitySummary:** Briefly summarize the main eligibility criteria (e.g., "For Omani nationals with high academic standing").
    *   **sourceUrl:** The direct URL to the scholarship page from the research data.
4.  **Summarize Findings:** Write a brief, encouraging summary of your findings.
5.  **Return Structured List:** Collate all the extracted scholarships into a JSON array.

Return the complete response in the specified structured JSON format. If no relevant scholarships are found, return an empty array for 'scholarships' and state that in the summary.
`,
})


const scholarshipFinderFlow = ai.defineFlow(
  {
    name: 'scholarshipFinderFlow',
    inputSchema: ScholarshipFinderInputSchema,
    outputSchema: ScholarshipFinderOutputSchema,
  },
  async (input) => {
    
    // Step 1: Use the web scraper agent (Rami) to conduct targeted research.
    // We create a few different search queries to get a wider range of results.
    const searchQueries = [
        `"${input.studyLevel}" scholarships for "${input.fieldOfStudy}" students in ${input.country || 'Oman'}`,
        `Oman Ministry of Higher Education scholarships ${input.fieldOfStudy}`,
        `Top universities in ${input.country || 'the Middle East'} offering ${input.studyLevel} scholarships in ${input.fieldOfStudy}`
    ];

    const researchJobs = searchQueries.map(query => scrapeAndSummarize({ source: query, isUrl: false }));
    const researchResults = await Promise.all(researchJobs);

    const researchData = researchResults.map(result => ({
        source: result.source,
        content: result.summary,
    }));
    
    // Step 2: Use the synthesizer agent to compile the research into a structured list.
    const { output } = await synthesizerPrompt({
        inputQuery: input,
        researchData: researchData,
    });
    
    return output!;
  }
);

    