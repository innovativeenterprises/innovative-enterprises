

'use server';

/**
 * @fileOverview An AI agent that generates materials for community elections.
 */
import { ai } from '@/ai/genkit';
import {
    ElectionGeneratorInputSchema,
    ElectionGeneratorInput,
    ElectionGeneratorOutputSchema,
    ElectionGeneratorOutput,
} from './community-elections-agent.schema';

export async function generateElectionMaterials(input: ElectionGeneratorInput): Promise<ElectionGeneratorOutput> {
  return electionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'electionGeneratorPrompt',
  input: { schema: ElectionGeneratorInputSchema },
  output: { schema: ElectionGeneratorOutputSchema },
  prompt: `You are an expert community manager and elections officer. Your task is to generate a complete set of materials for an upcoming community election.

**Election Details:**
- **Community Name:** {{{communityName}}}
- **Election Title:** {{{electionTitle}}}
- **Positions to be Elected:**
{{#each positions}}
  - {{this}}
{{/each}}
- **Nomination Deadline:** {{{nominationDeadline}}}
- **Election Date:** {{{electionDate}}}

**Your Tasks:**

1.  **Draft an Official Announcement:**
    *   Write a formal but clear announcement about the election.
    *   It should include the purpose of the election, the positions available, key dates (nomination deadline and election day), and a call for nominations.
    *   Format the announcement text using Markdown.

2.  **Generate a Nomination Form (HTML):**
    *   Create the HTML for a simple candidate nomination form.
    *   It should include fields for: Candidate's Full Name, Position they are running for (as a dropdown list using the provided positions), a textarea for a brief candidate statement, and a submit button.
    *   Use simple, clean HTML with inline styles for basic formatting. Wrap it in a \`<div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;">\`.

3.  **Generate a Ballot Paper (HTML):**
    *   Create the HTML for a ballot paper.
    *   For each position, create a section with a clear heading.
    *   Under each position, add placeholder checkboxes and labels for 3-4 sample candidates (e.g., "Candidate A", "Candidate B"). This is a template.
    *   Wrap it in a \`<div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;">\`.

Return all three generated assets in the specified structured JSON format.
`,
});

const electionGeneratorFlow = ai.defineFlow(
  {
    name: 'electionGeneratorFlow',
    inputSchema: ElectionGeneratorInputSchema,
    outputSchema: ElectionGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
